---
'@dle.dev/ember': patch
---

# Release Management

Add a small release-management feature and workflow improvements for the Ember component library.

What changed

- Add basic Release Management tooling and documentation to help create and track releases.
- Wire up changeset metadata so releases include a short release note and package bump.
- Small, non-breaking API additions to `src/lib/ember/index.ts` to support release metadata (consumer-facing impact is minimal).

Notes for consumers

- This is a patch release with no breaking changes. Consumers do not need to change how they import or use components.
- If you publish packages from this repo, you should see improved changelog/release notes generated automatically.

If you need more details about the implementation or want this split into separate package bumps, open an issue or PR on the repo.
