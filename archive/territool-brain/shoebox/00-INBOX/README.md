---
area: shoebox
tags: [brain/shoebox]
ref: "INBOX — drop anything here"
---

# INBOX — drop anything here

Put **anything** in this folder and the brain will notice it: documents, screenshots, screen
recordings, exports, spec PDFs, design files, CSVs, notes, a pasted chat log. No naming rules, no
subfolder rules. Just drop it.

`node tools/brain-start.js` (and `node tools/inbox-scan.js`) reports what is new since it last looked,
guesses what each item is, and suggests where it belongs.

**Nothing is filed automatically.** Where a document belongs is a judgement call, and a wrongly
auto-filed file is much harder to notice than an unfiled one. The brain proposes; you or Claude decide,
and then it is moved into the right `shoebox/` folder and cited from `brain/context/`.

Large media (video especially) is fine here — but tell the brain what it shows, because a filename
rarely does.
