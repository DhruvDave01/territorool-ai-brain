/**
 * F01 Login & session — API contract cases (BLOCKER / P0).
 *
 * Contract source: repos/web/app/Api/V2/Controllers/AuthController.php login(), registered as
 * POST login in repos/web/routes/api.php (v2 group). Every handled outcome returns HTTP 200 with
 * an envelope whose `status` is the STRING "1" or "0" (W-web §11: handled failures are 200/status:0).
 * The mobile app depends on that shape, so the envelope itself is asserted, not just the values.
 *
 * Side effect, disclosed rather than hidden: a successful login INSERTs a row into `usertoken`
 * (AuthController.php, $insDataArr). This suite is therefore not purely read-only; it adds one
 * device-token row per successful login. No credits, no purchase, no user creation.
 */
const { call } = require('../lib/env.js');

const LOGIN = 'login';
const MSG_INVALID = 'Please provide valid login details.';
const MSG_UNAUTHORIZED = 'You are not authorized to login. Kindly contact administrator.';
const MSG_OK = 'You have successfully logged-in.';

/** The envelope every login response must have, whatever the outcome. */
function assertEnvelope(t, r) {
  t.is(r.httpStatus, 200, 'HTTP 200 even for a handled failure (web §11)');
  t.ok(r.json && typeof r.json === 'object', 'body is JSON');
  t.ok(typeof r.json.status === 'string', '`status` is a string, not a number (mobile parses it as a string)');
  t.ok(['0', '1'].includes(r.json.status), '`status` is "0" or "1"');
  t.ok(typeof r.json.message === 'string' && r.json.message.length > 0, '`message` is a non-empty string');
  t.ok('data' in r.json, '`data` is present');
  t.ok('is_subscription_expired' in r.json, '`is_subscription_expired` is present');
}

module.exports = {
  flow: 'F01',
  title: 'Login & session',
  priority: 'P0',
  cases: [
    {
      id: 'TC-F01-001',
      title: 'Sales Agent logs in with valid credentials',
      type: 'happy',
      role: 'Sales Agent',
      refs: ['M3', 'S2.4'],
      async run(t, { account }) {
        const r = await call(LOGIN, { body: { email: account.email, password: account.pass, device_type: 'ios', device_token: 'QA-AUTO-contract' } });
        assertEnvelope(t, r);
        t.is(r.json.status, '1', 'login succeeds');
        t.is(r.json.message, MSG_OK, 'success message matches the controller');
        t.ok(r.json.data && typeof r.json.data === 'object', '`data` is the user object');
        t.ok(typeof r.json.data.token === 'string' && r.json.data.token.length > 20, 'a JWT is issued');
        t.is(r.json.data.role, 'Sales Agent', 'role comes back as Sales Agent');
        t.ok(['active', 'inactive'].includes(r.json.data.subscription_status), 'subscription_status is active/inactive');
        t.ok(typeof r.json.data.free_trial_status === 'boolean', 'free_trial_status is a boolean');
        t.ok(Number.isInteger(r.json.unread_notification_count), 'unread_notification_count is an integer');
        t.is(r.json.is_subscription_expired, false, 'is_subscription_expired is false for an active account');
        return { token: r.json.data.token };
      },
    },
    {
      id: 'TC-F01-002',
      title: 'Wrong password is rejected without leaking whether the account exists',
      type: 'negative',
      role: 'Sales Agent',
      refs: ['W2'],
      async run(t, { account }) {
        const r = await call(LOGIN, { body: { email: account.email, password: 'QA-AUTO-wrong-password' } });
        assertEnvelope(t, r);
        t.is(r.json.status, '0', 'login is refused');
        t.is(r.json.message, MSG_INVALID, 'generic message, identical to the unknown-account case');
        t.eq(r.json.data, [], '`data` is an empty array');
        t.ok(!JSON.stringify(r.json).includes('token'), 'no token is issued');
      },
    },
    {
      id: 'TC-F01-003',
      title: 'Unknown account gets the same message as a wrong password',
      type: 'security',
      role: 'Public',
      refs: ['W2'],
      async run(t) {
        const r = await call(LOGIN, { body: { email: 'qa-auto-no-such-user@example.invalid', password: 'QA-AUTO-wrong-password' } });
        assertEnvelope(t, r);
        t.is(r.json.status, '0', 'login is refused');
        t.is(r.json.message, MSG_INVALID, 'no account enumeration: same message as a wrong password');
      },
    },
    {
      id: 'TC-F01-004',
      title: 'Missing password is rejected by validation',
      type: 'validation',
      role: 'Public',
      refs: ['W2'],
      // Validation runs before any credential check, so this needs no real account.
      async run(t) {
        const r = await call(LOGIN, { body: { email: 'qa-auto-no-such-user@example.invalid' } });
        assertEnvelope(t, r);
        t.is(r.json.status, '0', 'login is refused');
        t.is(r.json.message, MSG_INVALID, 'validation uses the same generic message');
      },
    },
    {
      id: 'TC-F01-005',
      title: 'Missing email is rejected by validation',
      type: 'validation',
      role: 'Public',
      refs: ['W2'],
      async run(t) {
        const r = await call(LOGIN, { body: { password: 'QA-AUTO-wrong-password' } });
        assertEnvelope(t, r);
        t.is(r.json.status, '0', 'login is refused');
        t.is(r.json.message, MSG_INVALID, 'validation uses the same generic message');
      },
    },
    {
      id: 'TC-F01-006',
      title: 'Business Sales Agent logs in and is always treated as in free trial',
      type: 'happy',
      role: 'Business Sales Agent',
      refs: ['S2.4'],
      async run(t, { account }) {
        const r = await call(LOGIN, { body: { email: account.email, password: account.pass, device_type: 'ios', device_token: 'QA-AUTO-contract' } });
        assertEnvelope(t, r);
        t.is(r.json.status, '1', 'login succeeds');
        t.is(r.json.data.role, 'Business Sales Agent', 'role comes back as Business Sales Agent');
        t.is(r.json.data.free_trial_status, true, 'free_trial_status is forced true for a BSA (AuthController branch)');
        t.ok(typeof r.json.data.token === 'string', 'a JWT is issued');
      },
    },
    {
      id: 'TC-F01-007',
      title: 'Business Agent (Manager) cannot log in to the mobile API',
      type: 'permission',
      role: 'Business Agent',
      refs: ['BT-1', 'S2.4'],
      async run(t, { account }) {
        const r = await call(LOGIN, { body: { email: account.email, password: account.pass } });
        assertEnvelope(t, r);
        t.is(r.json.status, '0', 'the manager role is refused on the mobile API');
        t.is(r.json.message, MSG_UNAUTHORIZED, 'role-based refusal message');
        t.ok(!JSON.stringify(r.json).includes('token'), 'no token is issued');
      },
    },
    {
      id: 'TC-F01-008',
      title: 'Admin is blocked on the mobile API (BT-1 target behaviour)',
      type: 'permission',
      role: 'Admin',
      refs: ['BT-1'],
      knownGap: 'BT-1',
      // The controller lists Admin alongside Sales Agent and Business Sales Agent, so today Admin
      // IS admitted (VERIFIED runtime 2026-09-16). The Admin account is read-only (USER SAID 2026-09-16);
      // a login only inserts a `usertoken` row, like every other role. Device fields are sent exactly as
      // the app sends them — without them the server fails first (TC-F01-009).
      async run(t, { account }) {
        if (!account) return t.blocked('No Admin credentials in .local/test-accounts.md');
        const r = await call(LOGIN, { body: { email: account.email, password: account.pass, device_type: 'ios', device_token: 'QA-AUTO-contract' } });
        assertEnvelope(t, r);
        t.is(r.json.status, '0', 'BT-1: Admin must be refused on the mobile API');
        t.ok(!(r.json.data && r.json.data.token), 'BT-1: no token is issued to Admin');
      },
    },
    {
      id: 'TC-F01-009',
      title: 'A login without a device token fails cleanly, not with an SQL error',
      type: 'negative',
      role: 'Sales Agent',
      refs: ['W12', 'S5.4'],
      knownGap: 'UI-API-04',
      // Found 2026-09-16: validation does not require device_token, but the controller inserts it into
      // `usertoken` (NOT NULL), so a valid login without it returns HTTP 500 with the SQL text.
      async run(t, { account }) {
        const r = await call(LOGIN, { body: { email: account.email, password: account.pass } });
        t.ok(r.httpStatus < 500, 'no HTTP 5xx');
        t.ok(!/SQLSTATE/.test(r.text), 'no SQL error text in the body');
      },
    },
  ],
};
