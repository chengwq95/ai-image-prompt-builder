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
      geometry.computeVertexNormals(); geometry.computeBoundingBox(); geometry.computeBoundingSphere();
      variants.set(type, geometry); return geometry;
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
