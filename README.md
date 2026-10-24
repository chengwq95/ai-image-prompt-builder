# Prompt Lab

A single-page tool for writing AI image prompts by clicking instead of typing. Pick keywords from four blocks and get a copy-ready prompt — in **English** or Chinese — for Magnific (formerly Freepik), ChatGPT, Gemini, Grok and similar image tools.

**Live:** https://chengwq95.github.io/prompt-lab/ (once GitHub Pages is enabled)

Sister tool: [Video Prompt Builder](https://chengwq95.github.io/ai-video-prompt-builder/) — prompts for every step of a short AI video.

---

## Formula

```
Time + Subject + Scene + Style = one complete prompt
```

The first three blocks decide **what to draw**; Style decides **how it looks**.

| Block | What's inside |
|---|---|
| **Time** | Era / season / time of day |
| **Subject** | People (face, body, outfit, expression, pose), creatures, objects |
| **Scene** | Nature, places, weather |
| **Style** | Art style, mood, color, light, shot size, camera angle, composition, lens |

## Features

- **Beginner-friendly**: a 3-step quick start and a 1-minute **guided tour** that highlights each part of the page (a bottom sheet on phones). Reopen it any time from **Guide** in the top bar.
- **Nine templates**, each with a note on what it teaches: rainy-night detective, snow-mountain hunter, vintage object, Tang dynasty lady, bamboo-forest samurai, napping Shiba, Eastern myth, future city, retro teen.
- **Clickable keywords** in four tabs — click to add, click again to remove — plus your own custom keywords.
- **Random idea**: a random combination to practice with.
- **Live viewfinder**: the prompt builds at the bottom, color-coded by block, with a dot per block so you can see which one is missing.
- **Prompt language**: English or Chinese, switched separately from the interface — most image tools work best in English.
- **Troubleshooting checklist**: too flat / random-looking person / looks like a phone snapshot, and which block to add.
- **EN / 中文** interface switch (English by default) and **Morning / Night** themes (follows your system until you choose). Language and theme are shared with the Video Prompt Builder.
- Your keywords and settings are saved in your browser (`localStorage`), so a refresh doesn't lose your work.

## Output

One prompt, built from your keywords in block order (Time → Subject → Scene → Style), ready to copy with one click. For example:

```
modern day, autumn, late at night, 30-year-old Asian woman, short hair, round glasses, freckles,
dark green trench coat, tired, standing with an umbrella, neon-lit street, in the rain,
photorealistic, suspenseful, cool tones, neon lighting, medium shot, 85mm lens, shallow depth of field
```

## Tips built into the page

- Time is free lighting: late night brings neon and shadows, early morning brings mist and soft light.
- The more specific the subject (hair, glasses, freckles, outfit), the less "random face" you get.
- Light + shot size + lens is the trio that turns a snapshot into a movie still.
- When retrying, swap one or two words at a time so you know what made the difference.

## How to use

No install, no build step. It's a single HTML file: open `index.html` in any browser, on desktop or phone.

## Deploy to GitHub Pages

1. Repository **Settings → Pages**
2. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`
3. Save and wait 1–2 minutes, then open `https://chengwq95.github.io/prompt-lab/`
