# Carte météo Aussonne — Home Assistant

Carte Lovelace personnalisée : arrière-plan (ciel + montagnes) qui change
selon la condition météo actuelle (`weather.aussonne`) et le jour/nuit
(`sun.sun`), température, min/max du jour, icône animée, et prévisions
sur 4 jours.

Aperçu visuel (6 conditions) : voir l'artifact envoyé dans la conversation
Claude, ou ouvrir `preview.html` si fourni.

## Fichiers

- `www/weather-card-aussonne.js` — le composant de carte (à copier dans
  votre configuration Home Assistant).
- `weather-card-aussonne.yaml` — extrait de configuration prêt à copier.

## Installation

1. **Copier le fichier JS**
   Copiez `www/weather-card-aussonne.js` dans le dossier
   `config/www/` de votre installation Home Assistant (créez le dossier
   `www` s'il n'existe pas encore, à la racine de votre config, à côté de
   `configuration.yaml`).

   Résultat attendu : `config/www/weather-card-aussonne.js`

2. **Déclarer la ressource Lovelace**

   - Via l'interface (recommandé) : *Paramètres* → *Tableaux de bord* →
     menu ⋮ (en haut à droite) → *Ressources* → *Ajouter une ressource*
     - URL : `/local/weather-card-aussonne.js`
     - Type : *Module JavaScript*
   - Ou en YAML, dans `configuration.yaml` :
     ```yaml
     lovelace:
       resources:
         - url: /local/weather-card-aussonne.js
           type: module
     ```

3. **Ajouter la carte au tableau de bord**

   En mode édition du tableau de bord → *Ajouter une carte* → *Manuel*,
   collez :

   ```yaml
   type: custom:weather-card-aussonne
   entity: weather.aussonne
   sun_entity: sun.sun
   forecast_days: 4
   ```

4. Videz le cache du navigateur (Ctrl+F5) si la carte n'apparaît pas
   immédiatement après l'ajout de la ressource.

## Options de configuration

| Option          | Défaut          | Description                                   |
|-----------------|-----------------|------------------------------------------------|
| `entity`        | *(obligatoire)* | Entité météo, ex. `weather.aussonne`           |
| `sun_entity`    | `sun.sun`       | Entité soleil, pour le rendu jour/nuit         |
| `forecast_days` | `4`             | Nombre de jours affichés dans les prévisions   |
| `name`          | nom de l'entité | Titre affiché en haut de la carte              |

## Fonctionnement de l'arrière-plan

Le dégradé de ciel et les effets (étoiles, pluie, neige, brouillard) sont
choisis à partir de l'état de `entity` (`sunny`, `partlycloudy`, `cloudy`,
`rainy`, `pouring`, `lightning`, `lightning-rainy`, `snowy`, `snowy-rainy`,
`hail`, `fog`, `windy`, `exceptional`, `clear-night`) combiné à l'état de
`sun_entity` (`above_horizon` / `below_horizon`) pour les variantes
jour/nuit.

Les prévisions journalières sont récupérées via l'API moderne
`weather/subscribe_forecast` (Home Assistant ≥ 2023.9). Si l'intégration
météo ne la supporte pas, la carte se rabat sur l'attribut `forecast` de
l'entité s'il existe encore.
