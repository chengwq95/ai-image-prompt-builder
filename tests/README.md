# Regression checks

Run `node --test tests/*.test.cjs` from the repository root.

Checks cover continuous camera dragging, framing transitions, camera directions, pose controls, saved state, and smooth body geometry.

Body checks also cover type-specific bind shapes, neutral bone scales, child proportions, arm/hip isolation for every build, repeatable body switching, and reaching with either model position.

Anatomy/grip checks cover closed body-and-finger topology; running, sitting, overhead and wide hip poses; upright cups; wrist-relative prop attachment; finger contact; pair spacing; and one-time legacy grip migration.
