---
title: "Manager Bundle Build Artifact"
name: manager-bundle-build-artifact
description: public/js/manager-portal.js is a Vite build — edit JSX in resources/manager-portal/ then npm run build
type: project
---

The Manager Portal bundle `public/js/manager-portal.js` is a **build artifact**. Edit `resources/manager-portal/`, then `npm run build` (or `npm run dev`). `resources/js` is not the React app (it is essentially `revenuecat.js`).

Why: `vite.config.js`. Hand-edits to the bundle are overwritten and desync from source.

How to apply: after any JSX change, rebuild. Do not patch the compiled file.
