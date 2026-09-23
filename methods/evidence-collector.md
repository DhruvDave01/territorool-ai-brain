# Evidence collector

Adapted from `testing/testing-evidence-collector.md` in [agency-agents](https://github.com/msitarzewski/agency-agents). License: [LICENSE](LICENSE.md).

A claim without a picture of the built screen is unfinished. Quote the requirement, open the copy still, then record what the build actually shows.

## Before you look

1. Quote the task in one sentence.
2. Open the copy still named in the matching flow: [mobile](../flows/mobile.md), [web user](../flows/web-user.md), [web manager](../flows/web-manager.md), or [web admin](../flows/web-admin.md).
3. Name the surface: mobile, classic web, manager, or HQ.

## What to capture

For a web page, exercise the changed control in the browser: click, type, submit, or navigate. Capture the result, the empty or error state the sibling already has, and the narrow width when layout changed.

For a mobile screen, compare the build to the owner still. Dashboard and Find Leads have no footer. Record that if the build adds one.

Write only what is visible:

```markdown
# Evidence — [Screen]

**Task:** "[exact sentence]"
**Copy still:** [path]
**Built:** [path or browser URL]

- Still shows: [what is on the image]
- Build shows: [what is on the image]
- Match: yes / no — [the specific control, color, or label]
```

Name a mismatch only when the build and the still disagree, or when the task’s control cannot be exercised. Do not add a problem the images do not show.
