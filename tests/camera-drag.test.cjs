const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const M = vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../studio-model.js'), 'utf8') + ';CamPoseModel');
const center = [0, 0.98, 0];
const bounds = { min: [-0.35, 0, -0.12], max: [0.35, 1.95, 0.2] };
const project = M.makeView([-2.5, 2.1, 4.3], center, 36, 900, 500).project;
const angleDifference = (a, b) => ((a - b + 540) % 360) - 180;

test('a stationary grabbed control keeps its angle, including at projected ring folds', () => {
  for (let az = 0; az < 360; az += 3) for (const id of ['az', 'el', 'dist']) {
    const cam = { az, el: 19, dist: 1.03 }, pixel = project(M.cameraControlPoint(cam, id, center));
    const value = M.dragCameraControl(cam, id, pixel, project, center);
    assert.ok(Math.abs(id === 'az' ? angleDifference(value, cam[id]) : value - cam[id]) < 1e-7);
  }
});

test('a short drag stays on the nearby branch and moves closer to the pointer', () => {
  for (let az = 0; az < 360; az += 5) {
    const cam = { az, el: 19, dist: 1 }, pixel = project(M.cameraControlPoint(cam, 'az', center));
    const pointer = { x: pixel.x + 2, y: pixel.y + 1 };
    const value = M.dragCameraControl(cam, 'az', pointer, project, center);
    assert.ok(Math.abs(angleDifference(value, az)) <= 25.001);
    const moved = project(M.cameraControlPoint({ ...cam, az: value }, 'az', center));
    assert.ok(Math.hypot(moved.x - pointer.x, moved.y - pointer.y) <= Math.sqrt(5) + 0.001);
  }
});

test('distance controls stay on one fixed track while the preview changes framing', () => {
  const cam = { az: 108, el: 33, dist: 0.6 };
  for (let i = 0; i <= 80; i++) {
    const expected = 0.6 + i / 100, target = project(M.cameraControlPoint({ ...cam, dist: expected }, 'dist', center));
    cam.dist = M.dragCameraControl(cam, 'dist', target, project, center);
    assert.ok(Math.abs(cam.dist - expected) < 0.002);
  }
});

test('actual framing is continuous across the medium/full shot boundary at every elevation', () => {
  const J = M.skeleton(M.BASE());
  for (const aspect of [9 / 16, 1, 16 / 9]) for (const el of [-30, 0, 40, 75]) for (const dist of [1, 1.05, 1.2, 1.25]) {
    const a = M.framedCamera({ az: 45, el, dist: dist - 1e-7 }, J, aspect, bounds);
    const b = M.framedCamera({ az: 45, el, dist: dist + 1e-7 }, J, aspect, bounds);
    assert.ok(Math.hypot(...M.sub(a.pos, b.pos)) < 0.0001);
    assert.ok(Math.hypot(...M.sub(a.target, b.target)) < 0.0001);
    assert.ok(Math.abs(a.fov - b.fov) < 0.001);
  }
});

test('every low-angle framing distance stays above the floor and keeps its requested angle', () => {
  const J = M.skeleton(M.BASE());
  for (const el of [-30, -25, -10]) for (let i = 60; i <= 140; i++) {
    const cam = { az: 108, el, dist: i / 100 }, shot = M.framedCamera(cam, J, 9 / 16, bounds);
    assert.ok(shot.pos[1] >= 0.07999);
    assert.ok(Math.hypot(...M.sub(M.norm(M.sub(shot.pos, shot.target)), M.camDir(cam))) < 1e-8);
  }
});

test('full-shot framing continues to zoom out between 1.05 and 1.20', () => {
  const J = M.skeleton(M.BASE());
  const first = M.framedCamera({ az: 45, el: 10, dist: 1.05 }, J, 1, bounds);
  const second = M.framedCamera({ az: 45, el: 10, dist: 1.2 }, J, 1, bounds);
  assert.ok(Math.hypot(...M.sub(second.pos, second.target)) > Math.hypot(...M.sub(first.pos, first.target)) * 1.3);
});
