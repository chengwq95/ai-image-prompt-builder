/* Anatomical CC0 mesh with authored joint weights and integrated, articulated hands.
   Build data with tools/build-body.cjs. Body variants share the same edge-loop topology. */
const StudioSurface = (() => {
  function create(M, material, rig) {
    const data = StudioBodyData;
    if (data.version !== 2) throw new Error('The anatomical body data must be rebuilt');
    const decode = (value, Type) => {
      const raw = atob(value), bytes = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
      return new Type(bytes.buffer);
    };
    const ids = decode(data.skinIndex, Uint8Array), weights = decode(data.skinWeight, Uint8Array), index = decode(data.index, Uint16Array);
    const variants = new Map();
    function geometryFor(type) {
      if (variants.has(type)) return variants.get(type);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(Float32Array.from(decode(data.variants[type].position, Int16Array), n => n / 10000), 3));
      geometry.setAttribute('skinIndex', new THREE.Uint8BufferAttribute(ids, 4));
      geometry.setAttribute('skinWeight', new THREE.Uint8BufferAttribute(weights, 4, true));
      geometry.setIndex(new THREE.BufferAttribute(index, 1));
      mittenToes(geometry, type);
      geometry.computeVertexNormals(); geometry.computeBoundingBox(); geometry.computeBoundingSphere();
      variants.set(type, geometry); return geometry;
    }
    // A drawing mannequin has no separate toes: fold the toe area into one rounded foot front,
    // with a flat sole. Vertices move toward a smooth ellipsoid by how much the toe bone owns them.
    function mittenToes(geometry, type) {
      const pos = geometry.getAttribute('position'), frames = M.skinFrames(bindPose(type));
      for (const side of ['l', 'r']) {
        const bone = data.bones.indexOf(side + 'Toes'), F = frames[side + 'Toes'];
        if (bone < 0 || !F) continue;
        const R = F.matrix, local = [], own = [];
        for (let i = 0; i < pos.count; i++) {
          let w = 0;
          for (let k = 0; k < 4; k++) if (ids[i * 4 + k] === bone) w += weights[i * 4 + k] / 255;
          if (w < 0.02) continue;
          const d = [pos.getX(i) - F.position[0], pos.getY(i) - F.position[1], pos.getZ(i) - F.position[2]];
          // Into the toe frame (R is row-major; its transpose takes world to local).
          local.push([i, R[0] * d[0] + R[3] * d[1] + R[6] * d[2], R[1] * d[0] + R[4] * d[1] + R[7] * d[2], R[2] * d[0] + R[5] * d[1] + R[8] * d[2]]);
          own.push(w);
        }
        const core = local.filter((_, k) => own[k] > 0.5);
        if (core.length < 8) continue;
        const lo = [1, 2, 3].map(a => Math.min(...core.map(p => p[a]))), hi = [1, 2, 3].map(a => Math.max(...core.map(p => p[a])));
        const c = lo.map((x, a) => (x + hi[a]) / 2), r = lo.map((x, a) => Math.max(0.006, (hi[a] - x) / 2 * 1.04));
        local.forEach(([i, x, y, z], k) => {
          const q = [x - c[0], y - c[1], z - c[2]], m = Math.hypot(q[0] / r[0], q[1] / r[1], q[2] / r[2]) || 1;
          const t = [c[0] + q[0] / m, Math.max(lo[1], c[1] + q[1] / m), c[2] + q[2] / m];
          const s = Math.min(1, own[k] * 1.4), blend = s * s * (3 - 2 * s);
          const nx = x + (t[0] - x) * blend, ny = y + (t[1] - y) * blend, nz = z + (t[2] - z) * blend;
          pos.setXYZ(i, F.position[0] + R[0] * nx + R[1] * ny + R[2] * nz, F.position[1] + R[3] * nx + R[4] * ny + R[5] * nz, F.position[2] + R[6] * nx + R[7] * ny + R[8] * nz);
        });
      }
      pos.needsUpdate = true;
    }
    const bones = data.bones.map(name => { const bone = new THREE.Bone(); bone.name = name; rig.add(bone); return bone; });
    const rotation = new THREE.Matrix4();
    const bindPose = type => M.bindPose(type);
    function updateBones(frames) {
      data.bones.forEach((name, i) => {
        const { position, matrix: R } = frames[name];
        bones[i].position.set(...position);
        rotation.set(R[0], R[1], R[2], 0, R[3], R[4], R[5], 0, R[6], R[7], R[8], 0, 0, 0, 0, 1);
        bones[i].quaternion.setFromRotationMatrix(rotation); bones[i].scale.setScalar(1);
      });
      rig.updateMatrixWorld(true);
    }
    let activeType = 'male';
    updateBones(M.skinFrames(bindPose(activeType)));
    const skeleton = new THREE.Skeleton(bones), body = new THREE.SkinnedMesh(geometryFor(activeType), material);
    body.name = 'Anatomical drawing mannequin'; body.castShadow = true; body.receiveShadow = true; rig.add(body); body.bind(skeleton);
    function update(J, pose = M.BASE()) {
      const type = data.variants[pose.body] ? pose.body : 'male';
      if (type !== activeType) {
        activeType = type; body.geometry = geometryFor(type);
        updateBones(M.skinFrames(bindPose(type))); body.bind(skeleton);
      }
      updateBones(M.skinFrames(pose, J));
    }
    return { body, skeleton, update, get geometry() { return body.geometry; }, get type() { return activeType; }, vertices: data.vertices,
      dispose() { variants.forEach(g => g.dispose()); skeleton.dispose(); } };
  }
  return { create };
})();
