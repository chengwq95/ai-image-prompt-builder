# Prompt Lab

An interactive page that breaks "how to write an AI image prompt" into a formula you can click together:

```
Time + Subject + Scene + Style = one complete prompt
```

No memorizing needed: click a few keywords and the viewfinder at the bottom builds the full prompt live, ready to copy into your image tool.

**Live:** https://chengwq95.github.io/prompt-lab/ (once GitHub Pages is enabled on `main` / root)

Sister tool: [Video Prompt Builder](https://chengwq95.github.io/ai-video-prompt-builder/) — prompts for every step of a short AI video.

---

## What it covers

The hardest part of a prompt is often not *how* to write it, but knowing *which dimensions* you could write about. The page groups them into four blocks:

| Block | What's inside |
|---|---|
| **Time** | Era / season / time of day |
| **Subject** | People (face, body, outfit, expression, pose), creatures, objects |
| **Scene** | Nature, places, weather |
| **Style** | Art style, mood, color, light, shot size, camera angle, composition, lens |

## Features

- **Four blocks of clickable keywords** — click to add, click again to remove
- **Live viewfinder** — the prompt builds at the bottom, color-coded by block, so you can see which block is missing
- **Prompt in English or Chinese** — most image tools work best in English; switch the prompt language independently of the interface
- **9 templates** — rainy-night detective, snow-mountain hunter, vintage object, Tang dynasty lady, bamboo-forest samurai, napping Shiba, Eastern myth, future city, retro teen — each with a note on what it teaches
- **Random idea** — a random combination to practice with
- **Your own keywords** — add custom words to any block
- **One-click copy**
- **Troubleshooting checklist** — too flat / random-looking person / looks like a phone snapshot, and which block to add
- **EN / 中文** interface and **Morning / Night** themes; your choices and selected keywords are remembered in the browser

## How to use

No install, no build step. It's a single HTML file: open `index.html` in any browser, on desktop or phone.

## Tech

Plain HTML / CSS / JavaScript, zero dependencies, zero build — one file is the whole app.

## Local development

```bash
git clone https://github.com/chengwq95/prompt-lab.git
cd prompt-lab
open index.html   # or open it in any browser
```

## Deploy to GitHub Pages

1. Repository **Settings → Pages**
2. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`
3. Save and wait 1–2 minutes, then open `https://<username>.github.io/<repo>/`
