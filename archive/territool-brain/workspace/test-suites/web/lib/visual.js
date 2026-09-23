/**
 * Visual QA on web pages (2026-09-17), design-gate §B at 1440 and 390 px, in a real browser (lib/browser.js):
 * every visible text element renders in DIN (D-DS3), the page never scrolls sideways at 390 px, and a menu
 * control is visible at 390 px (design-system §5 rule 5). Screenshots: workspace/qa-evidence/<date>/web-visual/.
 * Read-only: navigation only; every non-GET request except the login form is aborted.
 */
const B = require('./browser.js');

const nonDin = (fonts) => Object.keys(fonts || {}).filter((f) => !/^DIN 2014|^FontAwesome|^Glyphicons/i.test(f));

function page(idA, idB, role, pathName, label, { fontGap, navGap, noNav } = {}) {
  const cases = [];
  cases.push({
    id: idA, title: `${pathName}: DIN only, no sideways scroll at 390 px`, type: 'visual', role, refs: ['D-DS3', 'DG-B'],
    knownGap: fontGap,
    pre: `${role} account`, steps: `1. open \`${pathName}\` at 1440 and 390 px\n2. read the computed font of every visible text element\n3. compare page scroll width with the viewport`,
    expected: 'every text element in DIN 2014 (icon fonts excepted); scroll width ≤ viewport at 390 px; screenshots saved',
    async run(t) {
      const wide = await B.measure(role, pathName, 1440, label);
      const narrow = await B.measure(role, pathName, 390, label);
      t.is(wide.status, 200, `HTTP 200 (${wide.shot})`);
      t.ok(nonDin(wide.textFonts).length === 0, `DIN only at 1440 (other: ${nonDin(wide.textFonts).join(', ') || 'none'})`);
      t.ok(nonDin(narrow.textFonts).length === 0, `DIN only at 390 (other: ${nonDin(narrow.textFonts).join(', ') || 'none'})`);
      t.ok(narrow.scrollWidth <= narrow.innerWidth, `no sideways scroll at 390 (${narrow.scrollWidth} ≤ ${narrow.innerWidth})`);
    },
  });
  if (noNav) return cases;
  cases.push({
    id: idB, title: `${pathName}: a menu control is visible at 390 px`, type: 'visual', role, refs: ['design-system §5 rule 5'],
    knownGap: navGap,
    pre: `${role} account`, steps: `1. open \`${pathName}\` at 390 px\n2. look for a visible menu / sidebar toggle`,
    expected: 'a visible menu control at 390 px (screenshot saved)',
    async run(t) {
      const narrow = await B.measure(role, pathName, 390, `${label}-nav`);
      t.ok(narrow.navVisible, `menu control visible at 390 (${narrow.shot})`);
    },
  });
  return cases;
}

module.exports = { page, teardown: B.close };
