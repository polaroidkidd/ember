---
name: pull-request-opener
description: Open GitHub pull requests from the current branch using the repository pull request template. Use when the user asks Codex to open, create, publish, or prepare a pull request. Requires filling `.github/pull_request_template.md`, opening a draft PR by default, and never prefixing the PR title with `[codex]`.
---

# Pull Request Opener

Open a GitHub pull request for the current branch while preserving repository
PR conventions and avoiding unrelated local changes.

## Workflow

1. Inspect the repository state:
   - Run `git status --short --branch`.
   - Run `git diff --stat` and `git diff --cached --stat`.
   - Determine the current branch with `git branch --show-current`.
   - Stop before staging, committing, or pushing if the worktree contains
     unrelated changes that are not part of the requested PR scope.

2. Determine the PR target:
   - Use the base branch named by the user when provided.
   - Otherwise use the repository default branch.
   - If needed, get it with `gh repo view --json defaultBranchRef`.

3. Prepare the branch:
   - Confirm the intended commits are already present, or create only the
     commit the user asked for.
   - Do not stage unrelated files.
   - Push the branch before opening the PR:
     `git push -u origin $(git branch --show-current)`.

4. Read `.github/pull_request_template.md` and fill it in as the PR body:
   - Keep the template section order and headings.
   - Replace HTML comments with concrete content.
   - Remove changelog subsections that do not apply.
   - Check completed checklist items with `[x]`; leave incomplete or
     not-applicable items unchecked only when the body explains why.
   - List exact verification commands run. If none were run, write `Not run`
     under `## Verification`.
   - Link issues in `## Related Issues`, or write `None`.

5. Choose the PR title:
   - Summarize the branch in a short imperative or noun-phrase title.
   - Do not prefix the title with `[codex]`.
   - If the generated or suggested title starts with `[codex]`, remove that
     prefix before creating the PR.

6. Open the PR:
   - Open a draft PR unless the user explicitly asks for ready-for-review.
   - Prefer the GitHub app connector when it can create the PR from the pushed
     branch with the filled title and body.
   - Use `gh pr create --draft --title <title> --body-file <file> --base <base>`
     as a fallback.
   - Use `gh pr create --title <title> --body-file <file> --base <base>` only
     when the user requested a non-draft PR.

7. Verify and report:
   - Confirm the created PR URL.
   - Confirm the PR title does not include `[codex]`.
   - Report the PR URL, branch, base branch, draft status, and verification
     commands.

## Body Guidance

Use the actual diff and user request to fill the template. Do not fabricate
tests, related issues, screenshots, or changeset status. For visible Svelte
route changes, mention whether screenshots or recordings were included.

The `## Summary` section should be concise prose or bullets describing what
changed and why. The `## Changelog` section should use only applicable
Keep a Changelog headings from the template.

## Safety

- Never push from `main`, `master`, or another protected/default branch unless
  the user explicitly asks for that.
- Never use `--force` or `--force-with-lease` unless the user explicitly asks
  for it.
- Never silently include local modifications that are unrelated to the PR.
- Stop and explain the blocker if the repository has no accessible GitHub
  remote or authentication is missing.
