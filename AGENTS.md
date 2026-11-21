# Command Routing & Repo Context

## Repos & Branches

Semua repo menggunakan branch **`rollback/2026-11-02`** saat ini.

| Repo | Path | Reference |
|---|---|---|
| Backend API | `api.kkpus.id/` | `@api` |
| Admin Portal | `admin.kkpus.id/` | `@admin` |
| Public Website | `kkpusid/` | `@public` |

## Command Routing

- `/qa` → Skill `qa` (QA Reviewer, ISO 27001, OWASP, code review & audit)
- `/full` → Skill `full` (Senior Fullstack Developer, end-to-end dev, secure coding)
- `/uiux` → Skill `uiux` (QA Senior UI/UX Designer, review tampilan, usability, WCAG, design system)

## Repo Context per Skill

Saat skill dijalankan, gunakan repo dan branch berikut:

| Skill | Repo(s) yang Digunakan |
|---|---|
| `/full` (Fullstack) | `@api`, `@admin`, `@public` — semua sesuai kebutuhan fitur |
| `/qa` (QA Reviewer) | `@api`, `@admin`, `@public` — semua repo untuk audit menyeluruh |
| `/uiux` (UI/UX) | `@admin`, `@public` — hanya frontend repos |

## Aturan

1. **Jangan pernah** mengubah branch tanpa instruksi eksplisit dari user.
2. **Selalu** verifikasi branch aktif sebelum melakukan perubahan.
3. **Gunakan reference** `@api`, `@admin`, `@public` untuk mengakses repo yang benar.
4. **Jangan** melakukan git push tanpa konfirmasi user.
