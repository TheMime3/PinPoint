# PinPoint

**PinPoint** is an experimental iPhone golf launch-monitor project.

Repository: `TheMime3/PinPoint`  
Target platform: iPhone  
Development machine: Windows + Visual Studio Code  
App stack: React Native / Expo SDK 57 / TypeScript + a custom Swift Expo Module.

## MVP goal

> Place phone -> detect ball -> READY -> hit -> automatically track shot -> display launch data and projected flight -> reset for the next ball.

## What is implemented in this package

### Camera / setup
- Native rear-camera preview.
- Guided phone-positioning screen.
- Ball-placement target zone.
- Phone roll / pitch telemetry using Core Motion.
- Lighting-quality telemetry.
- iOS camera permission handling.
- Automatic calibration state flow.
- Manual ball-lock fallback.

### Ball detection / ready state
- Experimental bright-ball detector constrained to the hitting zone.
- Detection overlay and confidence.
- Stable detection requirement.
- State machine:
  - `SEARCHING_FOR_BALL`
  - `BALL_FOUND`
  - `CALIBRATING`
  - `READY`
  - `CAPTURING`
  - `PROCESSING`
  - `SHOT_COMPLETE`

### Shot detection / tracking
- Automatic visual shot trigger based on sudden ball displacement, rapid apparent-size change, or brief loss of the armed ball.
- Post-impact tracking for as many usable frames as the MVP detector can identify.
- Timestamp, image position, apparent size, confidence, frame dimensions, and camera focal estimate retained for measurement.
- Tracking failure is rejected instead of manufacturing numbers.

### Measured / calculated values
Native engine attempts to directly derive:
- Ball speed.
- Vertical launch angle.
- Horizontal launch direction.

TypeScript flight model derives:
- Carry distance.
- Projected trajectory.

**Important:** spin is not measured in the MVP. The flight model uses a club-dependent spin assumption. Carry is therefore a model output, not a directly measured value.

### UI
- Blue / green / white PinPoint visual system.
- Manual club selection.
- Automatic results overlay.
- Perspective shot tracer.
- Current-session history saved locally.
- Measurement-quality indicator.
- Hidden diagnostics tab (long-press the version block in Settings).

## Current validation status

The source code implements the requested MVP pipeline, but **physical iPhone behavior and measurement accuracy have not been validated in this environment**.

Do not describe this build as an accurate launch monitor until:
1. The iOS development build compiles successfully in EAS.
2. The native camera pipeline is tested on the target iPhone.
3. Ball detection and automatic triggering are tested with real swings.
4. Measurements are benchmarked shot-for-shot against a trusted commercial launch monitor.

See `VALIDATION_CHECKLIST.md`.

## Quick setup

Read **`SETUP_IPHONE.md`** before building.

Typical first-time commands from Windows:

```powershell
npm install
npx expo install --fix
npm install --global eas-cli
eas login
eas build:configure
eas device:create
eas build --platform ios --profile development
```

After the build is installed on the iPhone:

```powershell
npm start
```

Then open the installed **PinPoint** development build and connect it to the Metro development server.

## Expo Go

Expo Go can load the TypeScript UI but **cannot load PinPoint's custom Swift launch-monitor module**. In Expo Go, the Launch screen displays a native-module warning and offers a demo shot so the UI can still be tested.

For actual camera tracking, use an EAS development build.

## Current measurement approach

The MVP uses:
- High-frame-rate rear-camera capture where supported.
- A target-zone bright-object detector.
- Stable pre-shot ball locking.
- Apparent golf-ball diameter as a monocular depth cue using the regulation ball diameter of 42.67 mm.
- Core Motion gravity to establish vertical direction.
- Weighted linear regression across tracked post-impact samples to derive the initial velocity vector.

This is a prototype measurement technique and must be experimentally validated.

## Project layout

```text
PinPoint/
├── App.tsx
├── app.json
├── eas.json
├── package.json
├── SETUP_IPHONE.md
├── VALIDATION_CHECKLIST.md
├── src/
│   ├── components/
│   ├── models/
│   ├── physics/
│   ├── screens/
│   ├── services/
│   └── theme/
└── modules/
    └── pinpoint-launch-monitor/
        ├── expo-module.config.json
        ├── PinPointLaunchMonitor.podspec
        ├── src/
        └── ios/
            ├── BallDetector.swift
            ├── LaunchCalculator.swift
            ├── PinPointCameraView.swift
            └── PinPointLaunchMonitorModule.swift
```

## Development rule

GitHub `main` is the source of truth for future PinPoint work. Before modifying the project, inspect the current repository state and reconcile it with this documentation.
