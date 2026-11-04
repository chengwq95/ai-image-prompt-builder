# Anatomical mesh compiler

The website loads the generated `studio-body-data.js`; it needs no network, package installation or build step at runtime.

To fetch the pinned CC0 MakeHuman assets and rebuild:

```
node tools/build-body.cjs --download
```

To rebuild from an existing source folder containing the files named in `human-assets-manifest.json`:

```
node tools/build-body.cjs --source-dir=/absolute/path/to/human-source
```

The compiler uses only Node built-ins. It retains the authored body/finger weights, remaps joints to `CamPoseModel.skinFrames`, retargets each shape to the editor's bind pose, and subdivides the anatomical quad loops once. The result is a closed connected mesh with 53,514 vertices, 107,024 triangles and 50 bones. Mesh variants, topology and quantized four-bone weights are bundled locally.

The revision and source hashes are pinned in `human-assets-manifest.json`. Source licenses and provenance are in `vendor/HUMAN-ASSETS.md`. After changing joint frames or finger rest dimensions, rebuild the data and run `node --test tests/*.test.cjs`. Body-data format changes must also update the asset version query in `index.html` so browsers load matching files.
