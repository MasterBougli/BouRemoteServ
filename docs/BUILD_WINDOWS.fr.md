# Build Windows

Utilise le script de packaging pour créer un build Windows autonome.

## Build en une commande

```powershell
.\scripts\build_windows.ps1
```

## Résultat

Le script crée un dossier distribuable et une archive zip dans `dist/`.

## Notes

- Le script crée son propre environnement virtuel temporaire.
- Il n'installe que la dépendance de packaging dont il a besoin.
- Le build obtenu est destiné à un usage local sur Windows.

