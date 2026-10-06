# PinPoint MVP Physical Validation Checklist

PinPoint's MVP is not considered validated merely because it compiles.

## A. Build validation

- [ ] `npm install` succeeds.
- [ ] `npx expo install --fix` completes.
- [ ] `npx expo-doctor` has no blocking problem.
- [ ] EAS iOS development build succeeds.
- [ ] Development build installs on the target iPhone.
- [ ] App opens without a native-module error.
- [ ] Camera permission flow works.
- [ ] Rear-camera preview appears.

## B. Setup / detector validation

Repeat under several lighting conditions.

- [ ] No ball -> `SEARCHING FOR BALL`.
- [ ] Ball enters target zone -> `BALL FOUND`.
- [ ] Stable ball -> `CALIBRATING`.
- [ ] Stable/calibrated ball -> `READY`.
- [ ] Detection box follows the actual ball.
- [ ] Detection confidence behaves sensibly.
- [ ] Low light is flagged.
- [ ] Manual ball lock works when automatic lock fails.
- [ ] Phone roll/pitch values react to physical movement.

## C. Automatic shot trigger

Test at least 30 real swings.

Record:
- True hit / miss.
- Did PinPoint leave `READY`?
- False trigger before impact?
- Trigger delay.
- Did it transition to `CAPTURING`?
- Did it return automatically for the next ball?

Calculate:
- Trigger success rate.
- False-trigger rate.
- No-read rate.

## D. Tracking validation

For each shot:
- Record frames tracked.
- Record tracking confidence.
- Inspect obvious false detections.
- Note lighting/background.
- Note club.
- Note ball speed range from reference device.

Investigate whether the detector accidentally tracks:
- Club head.
- Shoe.
- Tee.
- White range markers.
- Sky/background highlights.

## E. Reference launch-monitor benchmark

Use one trusted reference launch monitor and capture both devices on the same shot.

Recommended columns:

```text
Shot ID
Date/time
iPhone model
iOS version
Club
Lighting
Phone distance
Phone height
Reference ball speed
PinPoint ball speed
Reference launch angle
PinPoint launch angle
Reference launch direction
PinPoint launch direction
Reference carry
PinPoint carry
PinPoint quality
Frames tracked
Tracking confidence
Notes
```

For each primary metric calculate:
- Signed error.
- Absolute error.
- Mean error / bias.
- Mean absolute error.
- Standard deviation.
- 90th/95th percentile absolute error.
- No-read rate.

## F. Definition of Done

Only mark the MVP complete when this loop works repeatedly on the physical iPhone:

1. App opens launch monitor.
2. Ball placed.
3. Ball automatically detected or manual fallback succeeds.
4. System enters `READY`.
5. Golfer hits without pressing Record.
6. Shot is detected.
7. Ball is tracked.
8. Ball speed is returned.
9. Launch angle is returned.
10. Launch direction is returned.
11. Carry/trajectory are calculated.
12. Results appear automatically.
13. App re-arms for the next ball.

## Accuracy rule

Do not publish a numeric accuracy claim until the benchmark dataset supports it.
