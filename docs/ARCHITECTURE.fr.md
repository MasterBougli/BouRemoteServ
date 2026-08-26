# Architecture

BouRemoteServ est séparé en deux parties :

## Application de bureau

- Lance une icône dans la zone de notification Windows
- Sert l'interface web locale
- Reçoit les commandes de souris et de media
- Stocke les préférences localement

## Interface web mobile

- Fonctionne dans le navigateur du téléphone
- Utilise un thème sombre premium
- Fournit le pavé tactile, le pavé directionnel et les boutons media
- Affiche l'adresse locale et le QR code pour faciliter l'association

## Limites actuelles

- Un seul PC
- Réseau local uniquement
- Pas encore de code de jumelage
- Pas encore de volume ni de commandes clavier

