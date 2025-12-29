# @dle.dev/ember

## 3.0.0

### Major Changes

- a103778: # Remove actions from node snippet

  Remove CRUD helper actions from being spread onto the node-snippet and supply them via simple imports. Because of the tree component's children only have access to their own tree and it's children, updating a parent node from a child node is not possible. The only way to handle this in a clean fashion is to provide the CRUD functions directly.

## 2.0.0

### Major Changes

- 2dbbc61: # Update Tree API
  - Remove export of utility functions from `tree.utils`
  - Update, Insert and Delete functions now work by reference. We do not want to create a new tree every time

## 1.1.1

### Patch Changes

- 1734920: Fix the release script

## 1.1.0

### Minor Changes

- a55493c: # Release Notes

  ## Update Docs
  - `README.md` now reflects latest changes

- 892ddd9: # Release Notes
  - Update structure
    - Tests are now separate from the lib folder
    - Make usage of `svelte-lib-helpers`

## 1.0.0

### Major Changes

- 8044f74: # Migrate Accordion to Tree component

### Improve Tree component api to allow for more flexibillity

- Rename `Accordion` component to `Tree` component
- Add props to allow styling and controlling the node wrapper
- Rename types to be in line with tree terminology

### Update Path & Minor

| Package                                                                                                                                                                   | Type            | Update | Change                                                                                             | Pending  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ------ | -------------------------------------------------------------------------------------------------- | -------- |
| [@sveltejs/adapter-cloudflare](https://svelte.dev/docs/kit/adapter-cloudflare) ([source](https://redirect.github.com/sveltejs/kit/tree/HEAD/packages/adapter-cloudflare)) | devDependencies | patch  | [`7.2.3` -> `7.2.4`](https://renovatebot.com/diffs/npm/@sveltejs%2fadapter-cloudflare/7.2.3/7.2.4) |          |
| [@sveltejs/adapter-node](https://svelte.dev/docs/kit/adapter-node) ([source](https://redirect.github.com/sveltejs/kit/tree/HEAD/packages/adapter-node))                   | devDependencies | patch  | [`5.3.2` -> `5.3.3`](https://renovatebot.com/diffs/npm/@sveltejs%2fadapter-node/5.3.2/5.3.3)       |          |
| [eslint-plugin-yml](https://ota-meshi.github.io/eslint-plugin-yml/) ([source](https://redirect.github.com/ota-meshi/eslint-plugin-yml))                                   | devDependencies | minor  | [`1.18.0` -> `1.19.0`](https://renovatebot.com/diffs/npm/eslint-plugin-yml/1.18.0/1.19.0)          |          |
| [vite](https://vite.dev) ([source](https://redirect.github.com/vitejs/vite/tree/HEAD/packages/vite))                                                                      | devDependencies | patch  | [`7.1.8` -> `7.1.9`](https://renovatebot.com/diffs/npm/vite/7.1.8/7.1.9)                           |          |
| [wrangler](https://redirect.github.com/cloudflare/workers-sdk) ([source](https://redirect.github.com/cloudflare/workers-sdk/tree/HEAD/packages/wrangler))                 | devDependencies | minor  | [`4.40.3` -> `4.41.0`](https://renovatebot.com/diffs/npm/wrangler/4.40.3/4.41.0)                   | `4.42.0` |

## 0.0.4

### Patch Changes

- ff5c6b5: # Update Documentation
  - Include a roadmap for future components and utilities

## 0.0.3

### Patch Changes

- 26e83ad: # Release Management

  Add a small release-management feature and workflow improvements for the Ember component library.

  What changed
  - Add basic Release Management tooling and documentation to help create and track releases.
  - Wire up changeset metadata so releases include a short release note and package bump.
  - Small, non-breaking API additions to `src/lib/ember/index.ts` to support release metadata (consumer-facing impact is minimal).

  Notes for consumers
  - This is a patch release with no breaking changes. Consumers do not need to change how they import or use components.
  - If you publish packages from this repo, you should see improved changelog/release notes generated automatically.

  If you need more details about the implementation or want this split into separate package bumps, open an issue or PR on the repo.
