# Changelog

All notable changes to this project will be documented in this file.  
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added

- New features not yet released.

### Changed

- Updates or improvements.

### Fixed

- Bug fixes.

### Removed

- Deprecated or removed features.

---

## [1.0.0] - 2025-08-25

### Added

- Initial release of `sanity-plugin-unique`.
- `uniqueValidator` function for checking unique string fields in Sanity.
- Reusable field type: `{ name: "username", type: "unique:string" }`.
- Documentation: README, CONTRIBUTING guide, and publishing workflow.

---

## [1.0.1] - 2025-08-30

### Fixed

- **Unique validator bug**: now correctly excludes drafts and the current document from uniqueness checks.  
  This prevents false positives when updating a document’s own field (e.g., updating username `sikandardev`).
