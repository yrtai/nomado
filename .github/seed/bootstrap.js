/**
 * One-time project bootstrap: creates labels, milestones and Phase 0 issues.
 * Runs inside GitHub Actions with the built-in GITHUB_TOKEN. Idempotent:
 * re-running skips anything that already exists (matched by name/title).
 */
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.GITHUB_TOKEN;
const [OWNER, REPO] = process.env.GITHUB_REPOSITORY.split('/');
const API = `https://api.github.com/repos/${OWNER}/${REPO}`;

const seed = (f) =>
  JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));

async function gh(method, url, body) {
  const res = await fetch(url.startsWith('http') ? url : API + url, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 422) return { _exists: true }; // already exists
  if (!res.ok) throw new Error(`${method} ${url} -> ${res.status}: ${await res.text()}`);
  return res.json();
}

async function listAll(url) {
  const out = [];
  for (let page = 1; ; page++) {
    const batch = await gh('GET', `${url}${url.includes('?') ? '&' : '?'}per_page=100&page=${page}`);
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out;
}

(async () => {
  // 1. Labels
  const existingLabels = new Set((await listAll('/labels')).map((l) => l.name));
  for (const l of seed('labels.json')) {
    if (existingLabels.has(l.name)) {
      await gh('PATCH', `/labels/${encodeURIComponent(l.name)}`, l);
      console.log(`label ~ ${l.name}`);
    } else {
      await gh('POST', '/labels', l);
      console.log(`label + ${l.name}`);
    }
  }

  // 2. Milestones
  const milestones = await listAll('/milestones?state=all');
  const msNumber = new Map(milestones.map((m) => [m.title, m.number]));
  for (const m of seed('milestones.json')) {
    if (!msNumber.has(m.title)) {
      const created = await gh('POST', '/milestones', m);
      msNumber.set(m.title, created.number);
      console.log(`milestone + ${m.title}`);
    }
  }

  // 3. Issues (children first, then epics referencing their numbers).
  //    Reads every issues*.json file in this folder, in name order.
  const existingIssues = new Map(
    (await listAll('/issues?state=all')).map((i) => [i.title, i.number])
  );

  const create = async (title, body, labels, milestone) => {
    if (existingIssues.has(title)) {
      console.log(`issue = ${title}`);
      return existingIssues.get(title);
    }
    const created = await gh('POST', '/issues', { title, body, labels, milestone });
    console.log(`issue + #${created.number} ${title}`);
    existingIssues.set(title, created.number);
    await new Promise((r) => setTimeout(r, 1500)); // be gentle to abuse limits
    return created.number;
  };

  const issueFiles = fs
    .readdirSync(__dirname)
    .filter((f) => /^issues.*\.json$/.test(f))
    .sort();

  for (const file of issueFiles) {
    const data = seed(file);
    const milestone = msNumber.get(data.milestone);
    for (const epic of data.epics) {
      const childNumbers = [];
      for (const issue of epic.issues) {
        childNumbers.push(
          await create(issue.title, issue.body, issue.labels, milestone)
        );
      }
      const body =
        `${epic.intro}\n\n## Child issues\n` +
        childNumbers.map((n) => `- [ ] #${n}`).join('\n');
      await create(epic.title, body, epic.labels, milestone);
    }
  }

  // 4. Body fixups (optional, idempotent)
  const fixupsPath = path.join(__dirname, 'fixups.json');
  if (fs.existsSync(fixupsPath)) {
    for (const f of JSON.parse(fs.readFileSync(fixupsPath, 'utf8'))) {
      const issue = await gh('GET', `/issues/${f.number}`);
      if (issue.body && issue.body.includes(f.find)) {
        await gh('PATCH', `/issues/${f.number}`, {
          body: issue.body.replace(f.find, f.replace),
        });
        console.log(`fixup ~ #${f.number}`);
      }
    }
  }

  // 5. Close completed issues (optional, idempotent)
  const closePath = path.join(__dirname, 'close.json');
  if (fs.existsSync(closePath)) {
    const { comment, numbers } = JSON.parse(fs.readFileSync(closePath, 'utf8'));
    for (const n of numbers) {
      const issue = await gh('GET', `/issues/${n}`);
      if (issue.state === 'open') {
        if (comment) await gh('POST', `/issues/${n}/comments`, { body: comment });
        await gh('PATCH', `/issues/${n}`, {
          state: 'closed',
          state_reason: 'completed',
        });
        console.log(`closed #${n}`);
      }
    }
  }

  console.log('Bootstrap complete.');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
