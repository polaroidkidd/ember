---
'@dle.dev/ember': patch
---

Make the release script retryable when a release tag already exists but the npm
version was not published, and publish scoped releases with explicit public
access.
