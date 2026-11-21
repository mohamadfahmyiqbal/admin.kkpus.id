# Changelog — Template

## Versioning policy

This project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html):
- **MAJOR:** incompatible API/data/product behaviour change.
- **MINOR:** backward-compatible feature.
- **PATCH:** backward-compatible fix, security patch, or docs correction.

## How to update

1. Move relevant entries from `Unreleased` into a new version section.
2. Date each release in ISO-8601 (`YYYY-MM-DD`).
3. Tag the commit: `git tag -a vX.Y.Z -m "Release vX.Y.Z"` and push tags.
4. Update `HANDOFF.md` and `10_DEV_LOG.md` with the release state.

## Entry format

- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for bug fixes.
- `Security` for vulnerability fixes (reference CVE/advisory if available).
- `Performance` for performance improvements.
- `Database` for schema/migration changes.
- `API` for API contract changes (breaking or additive).
- `Documentation` for doc-only changes.

## Breaking change notation

Prefix with `BREAKING:` and explain migration steps. Bump MAJOR.