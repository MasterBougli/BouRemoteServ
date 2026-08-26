# Installation

## Avant de commencer

Tu as besoin de :

- Windows 10 ou Windows 11
- Python 3.12 ou plus récent si tu veux lancer depuis le code source
- Un navigateur sur le téléphone, connecté au même Wi-Fi local que le PC

## Lancer depuis le code source

1. Ouvre un terminal dans le dossier du projet.
2. Installe les dépendances :

```powershell
pip install -r requirements.txt
```

3. Démarre l'application :

```powershell
python main.py
```

4. Ouvre sur le téléphone l'adresse locale affichée par l'application.

## Utiliser la version packagée

1. Génère le package Windows :

```powershell
.\scripts\build_windows.ps1
```

2. Lance `BouRemoteServ.exe` depuis `dist\BouRemoteServ\`.
3. Ouvre l'adresse locale ou scanne le QR code du tableau de bord.
