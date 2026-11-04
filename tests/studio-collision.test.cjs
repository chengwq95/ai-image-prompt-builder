const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const { auditMesh } = require('./mesh-collision-audit.cjs');
const context = vm.createContext({ console, atob });
for (const file of ['vendor/three.min.js', 'studio-model.js', 'studio-body-data.js', 'studio-surface.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context);
const { M, T, surface } = vm.runInContext('({M:CamPoseModel,T:THREE,surface:StudioSurface.create(CamPoseModel,new THREE.MeshStandardMaterial(),new THREE.Group())})', context);
const full = process.env.STUDIO_FULL_AUDIT === '1';
const reported = [
  { id: 'phone', prop: 'phone' }, { id: 'hips' }, { id: 'run' },
  { id: 'run', prop: 'phone', seated: true }, { id: 'stand', prop: 'phone', seated: true },
  { id: 'think', prop: 'cup' }, { id: 'think', prop: 'book' },
  { id: 'sit', prop: 'phone', seated: true, chair: true }
];
const cases = full ? M.PRESETS.flatMap(p => [null, 'phone', 'cup', 'book', 'umbrella'].flatMap(prop => [false, true].map(seated => ({ id: p.id, prop, seated })))).concat([null, 'phone', 'cup', 'book', 'umbrella'].map(prop => ({ id: 'sit', prop, seated: true, chair: true }))) : reported;
for (const body of Object.keys(M.BODY_TYPES)) test(`actual mesh contact checks: ${body} (${cases.length} combinations)`, () => {
  for (const item of cases) {
    let p = M.normalizePose({ ...M.PRESETS.find(v => v.id === item.id).pose, body, preset: item.id });
    if (item.prop) p = M.holdProp(p, item.prop);
    if (item.seated) p = M.setSeated(p, true);
    if (item.chair) p.props.push('chair');
    M.resolveArms(p);
    const audit = auditMesh(surface, M, T, p, item.prop), label = JSON.stringify({ body, ...item });
    for (const [part, count] of Object.entries(audit.counts)) assert.equal(count, 0, `${label}: ${part} intersects actual body or furniture`);
    assert.ok(audit.floor >= -0.004 * M.BODY_TYPES[body].height, `${label}: foot below floor ${audit.floor}`);
  }
});
