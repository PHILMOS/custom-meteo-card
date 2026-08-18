# Custom Meteo Card — Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)

Carte Lovelace personnalisée : arrière-plan (dégradé de ciel + photo de
montagne) qui change selon la condition météo actuelle et le jour/nuit,
température avec icônes 3D animées, min/max du jour, humidité/vent, et
prévisions journalières + horaires.

## Fichiers

- `custom-meteo-card.js` — le composant de carte.
- `custom-meteo-card.yaml` — extrait de configuration prêt à copier.
- `hacs.json` — manifeste HACS.

## Installation via HACS

Ce dépôt n'est pas (encore) dans le magasin par défaut HACS : ajoutez-le
comme dépôt personnalisé.

1. HACS → menu ⋮ (en haut à droite) → **Dépôts personnalisés**.
2. URL du dépôt : `https://github.com/PHILMOS/custom-meteo-card`
   Catégorie : **Lovelace**.
3. Ouvrez la fiche **Custom Meteo Card** dans HACS → **Télécharger**.
4. Redémarrez Home Assistant si HACS ne recharge pas automatiquement
   les ressources Lovelace.

HACS enregistre automatiquement la ressource
(`/hacsfiles/custom-meteo-card/custom-meteo-card.js`). Passez directement
à [Ajouter la carte au tableau de bord](#ajouter-la-carte-au-tableau-de-bord).

## Installation manuelle

1. **Copier le fichier JS**
   Copiez `custom-meteo-card.js` dans le dossier `config/www/` de votre
   installation Home Assistant (créez le dossier `www` s'il n'existe pas
   encore, à la racine de votre config, à côté de `configuration.yaml`).

   Résultat attendu : `config/www/custom-meteo-card.js`

2. **Déclarer la ressource Lovelace**

   - Via l'interface : *Paramètres* → *Tableaux de bord* → menu ⋮ →
     *Ressources* → *Ajouter une ressource*
     - URL : `/local/custom-meteo-card.js`
     - Type : *Module JavaScript*
   - Ou en YAML, dans `configuration.yaml` :
     ```yaml
     lovelace:
       resources:
         - url: /local/custom-meteo-card.js
           type: module
     ```

## Ajouter la carte au tableau de bord

En mode édition du tableau de bord → *Ajouter une carte* → *Manuel*,
collez :

```yaml
type: custom:weather-card-aussonne
entity: weather.maville
sun_entity: sun.sun
forecast_days: 4
```

Videz le cache du navigateur (Ctrl+F5) si la carte n'apparaît pas
immédiatement après l'ajout de la ressource.

La carte dispose d'un éditeur visuel (via *Modifier* dans le tableau de
bord) — pas besoin d'écrire le YAML à la main.

## Options de configuration

| Option           | Défaut          | Description                                    |
|------------------|-----------------|-------------------------------------------------|
| `entity`         | *(obligatoire)* | Entité météo, ex. `weather.maville`            |
| `sun_entity`     | `sun.sun`       | Entité soleil, pour le rendu jour/nuit          |
| `forecast_days`  | `4`             | Nombre de jours affichés dans les prévisions    |
| `forecast_hours` | `5`             | Nombre d'heures affichées sous les prévisions   |
| `show_hourly`    | `true`          | Afficher la ligne de prévisions horaires        |
| `show_details`   | `true`          | Afficher humidité / vent si disponibles         |
| `tap_action`     | `more-info`     | `more-info` ou `none` (action au clic)          |
| `name`           | nom de l'entité | Titre affiché en haut de la carte               |

## Fonctionnement de l'arrière-plan

Le dégradé de ciel et les effets (étoiles, pluie, neige, brouillard) sont
choisis à partir de l'état de `entity` (`sunny`, `partlycloudy`, `cloudy`,
`rainy`, `pouring`, `lightning`, `lightning-rainy`, `snowy`, `snowy-rainy`,
`hail`, `fog`, `windy`, `exceptional`, `clear-night`) combiné à l'état de
`sun_entity` (`above_horizon` / `below_horizon`) pour les variantes
jour/nuit.

La photo de montagne est fixe (encodée directement dans le fichier JS) ;
elle remplit la carte sous l'en-tête (température/nom) jusqu'en bas, et
s'assombrit automatiquement la nuit.

## Icônes météo

Les icônes (soleil, lune, nuages, pluie, neige, orage, brouillard, vent)
sont un pack SVG 3D animé, avec dégradés/ombres/keyframes partagés une
seule fois dans le shadow DOM du composant (pas de duplication par
icône affichée).

## Prévisions

Les prévisions journalières et horaires sont récupérées via l'API moderne
`weather/subscribe_forecast` (Home Assistant ≥ 2023.9). Si l'intégration
météo ne la supporte pas, la carte se rabat sur l'attribut `forecast` de
l'entité pour les prévisions journalières (les prévisions horaires
nécessitent le support de `forecast_type: "hourly"` par l'intégration ;
la ligne d'heures reste masquée si l'intégration ne le supporte pas).
