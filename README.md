# Hello, I'm Kate Jo

A personal knowledge base and blog powered by Quartz 4.

## Overview

This repository is a personal blog that converts notes written in Obsidian into a static website using Quartz v4.

It combines Obsidian's powerful knowledge management with Quartz's beautiful web publishing — a space to organize and share thoughts.

**Link**: https://hellominjo.github.io


### Features

- `content` directory linked to Obsidian vault via symbolic link
- `[[wikilink]]` style internal links supported
- Fully compatible with Obsidian-flavored Markdown


## Tech Stack

| Category | Tech |
|------|------|
| Content Creation | Obsidian |
| Static Site Generator | Quartz v4 |
| Framework | Preact (Static Rendering) |
| Build Tools | esbuild, Lightning CSS |
| Deployment | GitHub Pages |


## Folder Structure

```
hellominjo/
├── content/             # Obsidian vault symbolic link (content)
├── quartz/              # Quartz framework core
│   ├── components/      # UI Components
│   ├── plugins/         # transformers, filters, emitters
│   └── ...
├── quartz.config.ts     # Site Configuration
├── quartz.layout.ts     # Page Layout
└── public/              # Build result for deployment
```