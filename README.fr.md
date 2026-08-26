# BouRemoteServ

**Langue :** [English](README.md) | [Français](README.fr.md) | [Español](README.es.md)

BouRemoteServ est une application Windows discrète dans la zone de notification qui expose une interface web locale pour contrôler ton PC depuis le téléphone, sans rien installer sur le téléphone.

## Version

- Statut actuel : `Non publié`
- Journal des versions : [changelog.md](changelog.md)
- Aucun tag de release n'existe encore

## Ce que fait le projet

- Déplacer la souris avec un pavé tactile depuis le téléphone
- Faire des petits ajustements avec un pavé directionnel
- Lancer `Play / Pause`, `Next` et `Previous`
- Rester discret dans la barre des tâches Windows
- Démarrer manuellement ou automatiquement avec Windows
- Basculer l'interface entre le francais et l'anglais
- Se connecter via l'adresse locale ou un QR code

## Pourquoi cette stack

- Windows en priorité
- Le téléphone utilise seulement le navigateur
- Réseau local uniquement, sans cloud
- Application discrète et native dans la zone de notification
- Une seule interface responsive pour téléphone et PC

## Structure du projet

- `main.py` lance l'application et le serveur local
- `remote_dock/` contient la logique de contrôle Windows
- `web/` contient l'interface mobile responsive
- `docs/` contient les guides d'installation et d'utilisation
- `scripts/` contient les outils de build Windows

## Démarrage rapide

1. Installe les dépendances.
2. Lance `python main.py`.
3. Ouvre l'adresse locale affichée sur le téléphone.
4. Utilise le QR code ou l'adresse manuelle pour te connecter.

## Lancer en local

1. Installe Python 3.12 ou plus récent.
2. Installe les dépendances :

```powershell
pip install -r requirements.txt
```

3. Démarre l'application :

```powershell
python main.py
```

4. Ouvre l'URL affichée dans le menu de la zone de notification ou scanne le QR code depuis le tableau de bord.

## Build Windows

Utilise le script de packaging :

```powershell
.\scripts\build_windows.ps1
```

Le résultat est placé dans `dist/`.

## Notes

- L'application écoute sur ton réseau local, donc le téléphone et le PC doivent être sur le même Wi-Fi.
- La version actuelle reste volontairement minimale : souris et commandes media uniquement.
- L'interface est pensée pour être sombre et premium par défaut.

## Documentation

- [Tutoriel](docs/TUTORIAL.fr.md)
- [Installation](docs/INSTALLATION.fr.md)
- [Utilisation](docs/USAGE.fr.md)
- [Architecture](docs/ARCHITECTURE.fr.md)
- [Build Windows](docs/BUILD_WINDOWS.fr.md)
- [Depannage](docs/TROUBLESHOOTING.fr.md)
- [Soutenir le projet](DONATE.fr.md)

## Choix de langue de la documentation

Choisis la version que tu veux lire :

| Langue | Ouvrir |
| --- | --- |
| English | [Ouvrir les docs EN](docs/README.md) |
| Francais | [Ouvrir les docs FR](docs/README.fr.md) |
| Español | [Ouvrir les docs ES](docs/README.es.md) |

## Suite possible

- Ajouter le volume
- Ajouter la synchronisation du presse-papiers
- Ajouter des raccourcis clavier
- Ajouter la sélection de plusieurs PC
- Préparer un installateur Windows signé

## Licence et contributions

- Projet sous licence AGPLv3 ou ultérieure
- Les contributions nécessitent un sign-off DCO
- Voir [LICENSE](LICENSE) et [DCO.fr.md](DCO.fr.md)
