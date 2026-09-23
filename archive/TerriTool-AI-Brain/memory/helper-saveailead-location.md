---
title: "Helper saveAILead Location"
name: helper-saveailead-location
description: Helper::saveAILead lives in app/Helpers/helpers.php, not only Globals/Helper.php
type: project
---

`Helper::saveAILead` is defined in `app/Helpers/helpers.php`. Do not assume it only lives in `Globals/Helper.php`.

Why: grep of the checkout; both Helper locations exist.

How to apply: search both files before changing save-AI-lead or credit decrement behavior. Shared writes belong where v2 already calls them.
