# Contributing Guide

## Welcome

This project follows a documentation-first workflow. Read `project-docs/` before making changes.

## Getting started

1. Fork or clone the repository.
2. Create a branch using the naming convention in `14_GLOBAL_STANDARDS.md` §1.
3. Set up the dev environment per `README.md` and `.env.example`.
4. Pick an unblocked `TODO` from `09_BACKLOG.md` or claim a task.

## Making changes

- Follow `12_CODING_STANDARDS.md` for code style.
- Keep changes small and focused; no unrelated refactors.
- Write/update tests for new behaviour.
- Update the affected specs if implementation diverges.
- Use Conventional Commits for commit messages.
- Open a PR linking the task ID and requirement IDs.

## Review

- At least 1 approval (2 for security/data changes).
- CI must be green.
- Address all review comments before merging.
- Squash merge with a clean Conventional Commit message.

## Reporting bugs / requesting features

- Open an issue with reproduction steps, environment, expected/actual.
- For security issues, follow `SECURITY.md` (do not open a public issue).

## Code of conduct

All contributors must adhere to `CODE_OF_CONDUCT.md`.