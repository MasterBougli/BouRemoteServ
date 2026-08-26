# Build Windows

Use the packaging script to create a standalone Windows build.

## One-command build

```powershell
.\scripts\build_windows.ps1
```

## Output

The script creates a distributable folder and a zip archive in `dist/`.

## Notes

- The script creates its own temporary virtual environment.
- It installs only the packaging dependency it needs.
- The resulting build is intended for local Windows use.

