# Excluded / Ignored Files

Files excluded from version control due to size thresholds or because they are build artifacts.
Size threshold for automatic exclusion: **52,428,800 bytes (50 MB)**.

| File name | Exact size | Exact full path | Importance |
|---|---|---|---|
| aws-advisor-site-deploy.zip | 264,814 bytes (0.25 MB) | C:\Users\Amir\awsskill\aws-advisor-site-deploy.zip | Build artifact (Firebase deploy bundle). Regenerable: `npm run build` + re-zip `dist/`. The site builds and deploys without it. |

## Notes

- No file in this repository meets or exceeds the 50 MB (52,428,800 bytes) threshold.
- `node_modules/` (123.66 MB) and `dist/` (0.54 MB) are dependency/build outputs, ignored via `.gitignore`, regenerable via `npm install` / `npm run build`.
- `shots/` (9 PNG screenshots, 18.45 MB total, largest single file 7.66 MB) is kept in version control — all files are well under 50 MB and serve as content/reference imagery.
