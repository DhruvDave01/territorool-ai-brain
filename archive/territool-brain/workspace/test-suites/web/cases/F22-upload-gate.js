/**
 * F22 Bulk CSV upload — auth gate (2026-09-17). GET only; the upload page itself is never opened while signed in.
 */
module.exports = {
  flow: 'F22', slug: 'upload-gate', title: 'Bulk CSV upload (auth gate)', priority: 'P2',
  source: '`routes/web.php:308` `uploadcompany/step1` (auth group)',
  cases: [{
    id: 'TC-F22-001', title: 'An anonymous request cannot open the upload wizard', type: 'negative', role: 'Public', refs: ['S3.8'],
    pre: 'none', steps: '1. GET `/uploadcompany/step1` without a session',
    expected: 'turned away: HTTP 401 (the runner sends AJAX headers, so Laravel answers 401) or a redirect to /login; no wizard page',
    async run(t, { session }) {
      const r = await (await session()).get('/uploadcompany/step1');
      t.ok(r.status === 401 || ([301, 302].includes(r.status) && /\/login$/.test(r.location || '')), `turned away (HTTP ${r.status}${r.location ? ` → ${r.location}` : ''})`);
      t.ok(!/Upload Companies|excel_file/.test(r.text), 'no upload wizard in the body');
    },
  }],
};
