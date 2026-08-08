# 🌀 Magic Moulinette

## 📋 Présentation du projet

La **Magic Moulinette** est un petit outil simple pour traiter et optimiser des images en batch (resize + conversion WebP), et générer automatiquement un JSON exploitable dans un projet frontend (Astro, site statique, etc.).

## ✨ Fonctionnalités

- Traitement par dossiers
- Conversion automatique en WebP
- Redimensionnement des images (max width configurable)
- Renommage propre et uniforme des fichiers
- Skip automatique des dossiers déjà traités
- Deux modes de traitement au choix (sélection interactive au lancement) :
  - **Galerie** : détection automatique de la cover + génération d'un fichier JSON prêt à l'emploi
  - **Simple** : conversion et renommage uniquement, sans cover ni JSON

## 🖼️ vs 🗂️ Modes de traitement

Au lancement du script, un prompt interactif (en anglais) demande quel mode utiliser :

```bash
◆  Which mode do you want to use?
│  ● 🖼️  Gallery  (Cover + JSON for a website)
│  ○ 🗂️  Simple  (Conversion + renaming only)
```

### 🖼️ Mode Galerie

Pensé pour alimenter un site (Astro, site statique, etc.) :

- Si une image contient "cover" dans son nom, elle est placée en premier (`-photo-000`).
- Un fichier `{slug}.json` est généré avec le `slug`, la `cover` et la liste des `images`.

### 🗂️ Mode Simple

Pensé pour un simple archivage/export de photos converties :

- Aucune détection de cover : les fichiers sont traités dans l'ordre alphabétique.
- Aucun fichier JSON n'est généré.
- Les images sont converties, redimensionnées et renommées de la même façon que le mode Galerie, puis placées dans `output/`.

## 📂 Structure attendue

### Input

```bash
input/
  2026-04-01-my-folder_ABCD/
    IMG_abc.jpg
    IMG_002.jpeg
    IMG_cover.jpg
```

### Output — mode Galerie

```bash
output/
  2026-04-01-my-folder/
    2026-04-01-my-folder-photo-000.webp
    2026-04-01-my-folder-photo-001.webp
    2026-04-01-my-folder.json
```

### Output — mode Simple

```bash
output/
  2026-04-01-my-folder/
    2026-04-01-my-folder-photo-000.webp
    2026-04-01-my-folder-photo-001.webp
```

### 📄 JSON généré (mode Galerie uniquement)

```json
{
  "slug": "2026-04-01-mon-evenement",
  "cover": "/assets/2026-04-01-my-folder/2026-04-01-my-folder-photo-000.webp",
  "images": [
    {
      "url": "/assets/2026-04-01-my-folder/2026-04-01-my-folder-photo-000.webp",
      "alt": ""
    }
  ]
}
```

## 🧠 Règles de fonctionnement

### 🏷️ Nom du dossier

- Format recommandé : YYYY-MM-DD-nom-du-dossier.
- Les suffixes _XXX_YYY sont automatiquement supprimés.

### ⭐ Cover (mode Galerie uniquement)

- Si une image contient "cover" dans son nom, elle est utilisée comme couverture.
- Par défaut, en l'absence de cover, c'est la première image (ordre alphabétique) qui est utilisée.
- En mode Simple, cette détection n'est pas appliquée : les fichiers sont traités dans l'ordre alphabétique.

### 📸 Formats supportés

- `.jpg`
- `.jpeg`
- `.png`
- `.webp`

### 🔁 Skip automatique

Si le dossier existe déjà dans `output/` , il est automatiquement ignoré.

## 🚀 Utilisation

### Installation

Cloner le repo et installer les dépendances.

```bash
npm install
```

### Configuration

À la racine du repo, créer un fichier `.env` et y ajouter les variables suivantes :

```env
INPUT_DIR=
OUTPUT_DIR=

MAX_WIDTH=
QUALITY=

BASE_URL=
```

### Chargement des images

Placer les dossiers à traiter dans le dossier `input/`.

### Lancer le serveur de dev

```bash
npm run dev
```

### 🧪 Exemple de sortie console

```bash
┌  🌀 Magic Moulinette
◆  Which mode do you want to use?
│  ● 🖼️  Gallery  (Cover + JSON for a website)
│  ○ 🗂️  Simple  (Conversion + renaming only)
└

🚀 Starting in "gallery" mode...

📦 2 folders detected
[
  '2026-04-01-my-amazing-folder_ALREADY_PROCESSED',
  '2026-04-01-my-amazing-folder'
]

🔍 Unpacking 2026-04-01-my-amazing-folder_ALREADY_PROCESSED

⏭️ Skipping 2026-04-01-my-amazing-folder_ALREADY_PROCESSED (already processed)

🔍 Unpacking 2026-04-01-my-amazing-folder

⚙️​ Processing folder: 2026-04-01-my-amazing-folder
💾​ Saved: 2026-04-01-my-amazing-folder-photo-000.webp (100.6 KB)
💾​ Saved: 2026-04-01-my-amazing-folder-photo-001.webp (157.5 KB)
✅ Total images processed: 2

🎉 Processing complete! Duration: 1.98 seconds.
```
