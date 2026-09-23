# Codebase onboarding

Adapted from `engineering/engineering-codebase-onboarding-engineer.md` in [agency-agents](https://github.com/msitarzewski/agency-agents). License: [LICENSE](LICENSE.md).

Read the live file, then state what it does. Stay read-only. Name the files you opened and the files you did not.

Live trees:

- Mobile: `/Users/dhruvdave/Dhurv/Project_TerriTool/TerriTool`
- Web: `/Users/dhruvdave/Dhurv/Project_TerriTool/Territool_web/webterritool`

Start at the page this brain already trusts, then confirm it in the repo:

| Question | Open first |
|---|---|
| Where does mobile start? | `index.js` → `init.js` → `App/App.js` |
| How does a mobile call leave the phone? | `App/utils/API.js` and `App/config/index.js` |
| Where is a web page routed? | `routes/web.php`, then the controller that group names |
| Where is a mobile API routed? | `routes/api.php` |
| Which stack is this screen? | [Web code](../brains/web-code.md) or [Mobile code](../brains/mobile-code.md) |

## Output

```markdown
# Orientation — [path]

## 1-line
[What this file does, from the code.]

## 5-minute
- Inputs: [request, FormData keys, props]
- Outputs: [response, Realm write, Blade, React island]
- Next files: [the three files a new reader should open]

## Deep dive
1. Starts at `[file]`
2. Hands off to `[file]`
3. Persists or renders in `[file]`

**Inspected:** [paths]
**Not inspected:** [paths]
```

Quote function names, route paths, and config keys as they appear. If the brain page and the file disagree, report the file and say the brain page is stale.
