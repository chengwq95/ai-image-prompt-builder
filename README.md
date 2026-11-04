# AI Image Prompt Builder

A static, single-page tool for writing AI image prompts by clicking instead of typing. Pick keywords from four blocks and get a copy-ready prompt — in **English** or Chinese — for Magnific (formerly Freepik), ChatGPT, Gemini, Grok and similar image tools.

**Live:** https://ai-image-prompt-builder.pages.dev/

Companion tool: [AI Video Prompt Builder](https://ai-video-prompt-builder.pages.dev/) — prompts for every step of a short AI video.

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
- **True 3D camera & pose**: anatomical artist's mannequins based on the locally bundled CC0 MakeHuman mesh, with continuous body/hand topology, authored joint weights, real perspective, depth and shadows. Switch between **3D form** and **Study lines**. Use 13 poses or edit **18 parts / 54 angle controls**: pelvis, spine, neck, head, shoulders, elbows, forearms, wrists, individual finger curls, hips, knees, ankles and toes. Select a joint or body surface to drag it, or use the sliders and arrow keys for precise angles. Reset a single joint, mirror it, or swap both sides.
- **Drag to reach**: drag a wrist, hand or ankle and the whole arm or leg bends to follow (inverse kinematics), or fine-tune any joint with sliders.
- **Body types and props**: adult man, adult woman, slim, muscular or child, each with a cached anatomical mesh variant. Shoulder/hip widths and limb lengths follow the chosen build; the child uses a larger relative head and shorter limbs. The adult female chest is part of the continuous surface. A phone, cup, umbrella or book in the right hand (the arm lifts to hold it), plus a chair and a table. Held props share the hand's position and orientation, with editable finger grips and a **Reset grip** action. Props and build are described in the prompt.
- **Two models**: use **+ Model** to add **B**, then switch between **A / B** (matching the labels above each figure). Both models have position controls; **Distance between models** moves them equally, from 0.20–4.00 m, while preserving their poses for two-shots and over-the-shoulder shots; the prompt names who is on the left and right of the frame.
- **Lighting**: a Light tab with a draggable sun, front / Rembrandt / side / back / top presets and soft or hard shadows. The words describe the light as the camera sees it, and replace the Light keywords when turned on.
- **Download the camera view**: save the actual camera view as a PNG to upload as a pose and composition reference.
- **Consistent camera directions**: azimuth is relative to the body (0° front, 90° the subject's right, 180° back, 270° left). Camera handles, the actual preview and generated prompt use the same coordinate convention, including after turning the body. The main **studio view** is independent: orbiting or zooming it does not change the prompt's camera. The explicit **Frame whole body** action fits both visible models and their posed limbs, including raised hands, while keeping the aim on the upper body. When the 3D camera is on it replaces the shot-size and angle keywords so the prompt never contradicts itself.
- **Physical camera controls**: the yellow camera icon, sight line and preview use exactly the same position and look-at target. Distance is measured in metres (0.20–8.00 m); the camera can pass through the pink elevation reference arc. The default target is the chest, with explicit **Head**, **Chest** and **Frame whole body** choices. Moving closer never changes the aim point or secretly changes the lens. The studio view stays stable during dragging, and the displayed elevation respects the ground limit.
- **Random idea**: a random combination to practice with.
- **Live viewfinder**: the prompt builds at the bottom, color-coded by block, with a dot per block so you can see which one is missing.
- **Prompt language**: English or Chinese, switched separately from the interface — most image tools work best in English.
- **Troubleshooting checklist**: too flat / random-looking person / looks like a phone snapshot, and which block to add.
- **EN / 中文** interface switch (English by default) and **Morning / Night** themes (follows your system until you choose). Language and theme are shared with the AI Video Prompt Builder.
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

No install or build step. Open `index.html` in a modern WebGL 2 browser, on desktop or phone, or serve the folder with any static server. Keep `studio.js`, `studio-model.js`, `studio-surface.js`, `studio-body-data.js` and `vendor/` next to `index.html` when copying or deploying the project. Three.js is bundled locally; the 3D studio needs no CDN, external model or texture download. If WebGL is unavailable, the angle controls and prompt output remain usable.

Saved poses from the original studio are upgraded with defaults for the new joints. Keywords and prompt settings are preserved.

## Check the pose and camera model

With Node.js installed:

```
node --test tests/*.test.cjs
```

Regression checks cover body/camera handedness, all 54 angle controls, legacy saved poses, invalid values, bone lengths, ankle inheritance, camera framing transitions, bilingual pose descriptions, connected mesh topology, surface normals, skinning weights, and hip stability when raising an arm. The render library version and license are recorded in `vendor/README.md`.

The continuous body and fingers have 53,514 shared vertices and 107,024 triangles, driven by 56 skinning bones. Forearm rotation is distributed from elbow to wrist to preserve volume, with tapered muscle fullness for each build. The joint picker renders the same anatomical mesh in a neutral front view, matching the selected body type. Geometry and weights are bundled for offline startup. Rebuild with `node tools/build-body.cjs --download`; see `tools/README.md` and `vendor/HUMAN-ASSETS.md` for pinned sources, CC0 licensing and cached-source builds.

## Deploy to GitHub Pages

1. Repository **Settings → Pages**
2. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`
3. Save and wait 1–2 minutes, then open `https://chengwq95.github.io/ai-image-prompt-builder/`
