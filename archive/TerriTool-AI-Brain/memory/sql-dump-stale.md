---
title: "SQL Dump Stale"
name: sql-dump-stale
description: database/webterritool.sql is a 2021 dump; live DB has 83 tables including unrelated coffee/bookings
type: project
---

Do not trust `database/webterritool.sql`. Schema truth is live MySQL. Do not query or migrate `coffee_*`, `bookings`, `booking_*`, or `stocks`.

Why: dump has 37 tables; live DB has 83. Unrelated app tables (`coffee_orders`, `bookings`) sit in the same MySQL database. `knowledge/code/data-model-reference.md`.

How to apply: `SHOW TABLES` / `SHOW COLUMNS` against live `territool`, not the dump. Never import the dump over local data.
