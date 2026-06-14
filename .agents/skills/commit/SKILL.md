---
name: commit
description: Create git commits with human-readable commit messages that follow Chris Beams' seven rules and use Keep a Changelog-style change categories in the body. Use when Codex is asked to commit changes, draft a commit message, split staged or unstaged work into commits, or improve commit history.
---

# Changelog Commit

Create commits whose subject line works well with Git tooling and whose body
summarizes user-visible or maintainer-relevant changes using Keep a
Changelog-style structure.

## Workflow

1. Inspect the worktree before committing:
   - Run `git status --short`.
   - Run `git diff --stat` and `git diff --cached --stat`.
   - If changes are already staged, treat the staged diff as the requested
     commit scope unless the user says otherwise.
   - If nothing is staged, inspect the relevant unstaged and untracked changes
     before choosing what to stage.

2. Keep commits atomic:
   - Group one coherent change per commit.
   - Do not include unrelated files just because they are present.
   - Leave user or unrelated work untouched unless the user explicitly includes
     it in the commit.
   - If the diff contains unrelated changes, create multiple commits or ask the
     user before staging ambiguous work.

3. Write the subject with the seven rules:
   - Separate subject from body with one blank line when a body exists.
   - Aim for 50 characters or fewer; never exceed 72 unless unavoidable.
   - Capitalize the subject.
   - Do not end the subject with a period.
   - Use imperative mood: "Add", "Fix", "Remove", "Document".
   - Wrap body text at 72 characters.
   - Use the body for what changed and why, not a line-by-line how.

4. Use Keep a Changelog categories in the body when a body is useful:
   - `Added` for new features.
   - `Changed` for changes in existing functionality.
   - `Deprecated` for soon-to-be removed features.
   - `Removed` for removed features.
   - `Fixed` for bug fixes.
   - `Security` for vulnerability-related changes.

5. Commit with an explicit message file or multiple `-m` arguments. Prefer a
   message file for bodies so wrapping and blank lines are preserved.

## Message Format

Use a single-line subject for trivial changes:

```text
Fix typo in API route comment
```

Use a body for changes that need context:

```text
Add profile image cleanup job

Added:
- Scheduled cleanup for image records with no owning profile.
- Worker configuration for the new cleanup queue.

Fixed:
- Dangling images no longer remain after profile deletion.
```

The body borrows the Keep a Changelog section names, but this is still a commit
message, not a release changelog. Include only categories that apply to this
commit. Omit empty sections.

## Body Guidelines

- Prefer bullets under category headings for readability.
- Explain user-visible behavior, maintenance impact, migration notes, and
  important reasons behind the change.
- Keep bullets concise and wrapped at 72 characters.
- Do not dump the raw git diff or file list into the message.
- Do not fabricate intent, rejected alternatives, or risk context that is not
  evident from the diff or conversation.
- Mention tests only when the verification result is relevant to future readers,
  such as a new regression test or an intentionally untested edge.

## Before Running `git commit`

Validate the final message:

- Subject is imperative, capitalized, <= 50 target characters, and has no
  trailing period.
- Body, if present, starts after exactly one blank line.
- Body uses only applicable Keep a Changelog headings.
- Body lines are wrapped at 72 characters where practical.
- The staged diff matches the subject and body.

Then run `git commit`.

## Examples

Feature commit:

```text
Add organization invitation expiry

Added:
- Expiry timestamp on organization invitations.
- Validation that rejects expired invitation acceptance.

Changed:
- Invitation lookup now returns an explicit expired state.
```

Bug fix commit:

```text
Fix session refresh after OAuth callback

Fixed:
- OAuth callbacks now refresh the Better Auth session before redirecting.
- Protected routes no longer show a stale anonymous state after sign-in.
```

Security commit:

```text
Reject weak password reset tokens

Security:
- Password reset now rejects tokens generated before the active secret.
- Reset attempts are logged without exposing token values.
```
