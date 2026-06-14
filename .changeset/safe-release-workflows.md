---
'@dle.dev/ember': patch
---

Harden CI and release workflows so staging deploys wait for checks, production
publishes only run for version tags, release notes run correctly on Node 24, and
npm publishing happens after the release tag is pushed.
