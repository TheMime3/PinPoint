# Golf Launch Monitor

> **Project status:** Product planning / prototype stage  
> **Primary development machine:** Windows PC + Visual Studio Code  
> **Primary target:** iPhone  
> **App stack:** React Native + Expo + TypeScript, with custom native Swift modules for the high-speed iPhone camera / launch-measurement engine

---

## 1. Project Vision

Build an iPhone-based golf launch monitor that lets a golfer:

1. Place an iPhone near the hitting area.
2. Put a golf ball inside a guided capture zone.
3. Wait for the app to automatically detect the ball and report **READY**.
4. Swing normally without pressing a record button.
5. Have the app capture and track the ball immediately after impact.
6. Receive launch data and a visual ball-flight tracer.
7. Save the shot into a practice session for later analysis.

The long-term goal is to turn the iPhone into an affordable golf practice platform that can eventually support launch monitoring, club data, multi-camera tracking, bag gapping, training games, and simulator integration.

### Core product rule

**Accuracy before feature count.**

The app should never present an estimated value as though it were directly measured. Every metric should have a clear measurement source and, where useful, a confidence level.

---

# 2. Product Identity

## Color palette

The visual identity should feel like modern sports technology rather than a traditional country-club golf app.

| Role | Color | Hex |
|---|---|---|
| Primary | Deep Blue | `#0D47A1` |
| Main Background | Navy | `#081B33` |
| Primary Action / Ready State | Golf Green | `#22C55E` |
| Bright Accent | Lime Green | `#4ADE80` |
| Primary Text | White | `#FFFFFF` |
| Secondary Text | Cool Gray | `#B6C2D1` |
| Warning | Amber | `#F59E0B` |
| Error | Red | `#EF4444` |

## Visual rules

- Blue / navy should dominate the application shell.
- Green should communicate readiness, successful detection, active tracking, and ball-flight tracers.
- White should be used for major measurements and high-contrast text.
- Yellow / amber should indicate questionable measurement quality or setup warnings.
- Red should be reserved for failed setup, capture failure, or unusable data.
- Data should remain readable outdoors in bright conditions.
- Results should prioritize large numbers and fast readability over decorative elements.

---

# 3. Technical Strategy

Because development is being performed on Windows, the project will use a hybrid architecture.

```text
Windows PC
Visual Studio Code
      |
      v
React Native + Expo + TypeScript
      |
      |-- UI
      |-- Navigation
      |-- Sessions
      |-- Shot history
      |-- Bag management
      |-- Training modes
      |-- Ball-flight visualization
      |-- General application logic
      |
      v
Custom Expo Native Module
Swift / iOS
      |
      |-- AVFoundation camera control
      |-- High-frame-rate capture
      |-- Camera calibration
      |-- Ball detection / tracking
      |-- Impact detection
      |-- Core ML / Vision integration
      |-- Launch-vector measurement
      |-- Native performance-critical processing
      |
      v
Structured Shot Data
      |
      v
React Native UI
```

### Why this architecture?

Expo / React Native lets most of the application be developed on Windows in Visual Studio Code. Expo's development-build workflow supports custom native modules, and Expo's Modules API supports Swift for iOS-native functionality.

The high-speed camera pipeline should **not** send every high-frame-rate camera frame through JavaScript. Performance-sensitive capture, image processing, and tracking should remain native on iOS. The native layer should return compact shot results to the TypeScript application.

Example result object:

```ts
interface ShotMeasurement {
  ballSpeedMph: number;
  launchAngleDeg: number;
  launchDirectionDeg: number;
  carryYards: number;
  measurementQuality: number;
  measuredAt: string;
}
```

---

# 4. Version Roadmap

## Roadmap Summary

| Version | Main Goal |
|---|---|
| MVP | Prove that the iPhone can automatically detect, track, and measure a golf shot |
| V1 | Turn the prototype into a useful range / practice launch monitor |
| V2 | Add advanced spin and club-head measurements |
| V3 | Add dual-iPhone tracking for improved 3D measurement |
| V4 | Build a complete golf-practice and analytics platform |
| V5 | Add simulator, multiplayer, and ecosystem functionality |

---

# 5. MVP — "It Actually Works"

## Goal

Prove the fundamental launch-monitor loop:

> Place phone -> detect ball -> READY -> hit -> automatically track shot -> display launch data and projected flight -> reset for the next ball.

## MVP Features

### Camera and setup

- Live camera view.
- Guided phone-positioning screen.
- Ball-placement target zone.
- Camera roll / pitch alignment indicator where possible.
- Lighting-quality indicator.
- Camera-permission handling.
- Automatic calibration workflow.
- Manual calibration fallback.

### Ball detection

- Detect a golf ball in the hitting zone.
- Draw an overlay around the detected ball.
- Display detection confidence.
- Require stable detection before entering the ready state.

### Ready state

Possible states:

```text
SEARCHING FOR BALL
BALL FOUND
CALIBRATING
READY
CAPTURING
PROCESSING
SHOT COMPLETE
```

The golfer should not have to press **Record** before each swing.

### Impact / shot detection

- Detect that a shot has occurred.
- Preserve frames around impact using a rolling capture buffer where practical.
- Automatically transition from READY to CAPTURING.

Potential impact signals may include:

- Sudden ball displacement.
- Visual club movement.
- Audio impulse from impact.
- Combination of visual and audio evidence.

The final trigger method must be validated experimentally.

### Initial ball tracking

Track the golf ball for as many clean post-impact frames as possible.

Store, at minimum:

```text
Frame timestamp
Ball center X
Ball center Y
Apparent ball size / bounding box
Detection confidence
Camera calibration information
```

### Initial measured data

Target direct measurements:

- Ball speed.
- Vertical launch angle.
- Horizontal launch direction.

### Initial calculated data

Derived from measured launch parameters and the current physics model:

- Carry distance.
- Initial projected trajectory.

### Shot visualization

- Clean shot tracer.
- Side / perspective trajectory view.
- Large carry-distance result.
- Automatic transition to results after processing.

### Club selection

Manual club selection for MVP.

Suggested initial club list:

- Driver
- 3 Wood
- 5 Wood
- 7 Wood
- Hybrids
- 3–9 Iron
- PW
- GW
- SW
- LW
- Custom club

### Shot result screen

Example:

```text
7 IRON

                 /---------
             /---          ---
         /---
      o--

             171 YDS

BALL SPEED          118.4 mph
LAUNCH                17.6°
DIRECTION             1.4° R
CARRY                 171 yd

MEASUREMENT QUALITY
█████████░            92%
```

### Session history

During the active session, store:

- Shot number.
- Club.
- Timestamp.
- Ball speed.
- Launch angle.
- Launch direction.
- Carry.
- Measurement quality.

### Diagnostic mode

A hidden / developer-facing diagnostic view should expose information such as:

```text
Camera FPS
Capture resolution
Exposure / shutter information
Ball detected: yes / no
Detection confidence
Frames successfully tracked
Tracking confidence
Phone orientation
Calibration state
Lighting state
Measurement quality
Processing time
```

This screen will be extremely important while validating the camera system.

## MVP Definition of Done

The MVP is complete only when the following loop works repeatedly on a physical iPhone:

1. App opens the launch-monitor screen.
2. Ball is placed down.
3. App automatically detects it.
4. App enters READY.
5. Golfer hits without pressing another control.
6. Shot is detected automatically.
7. Ball is tracked after impact.
8. Ball speed, launch angle, and launch direction are produced.
9. Carry and trajectory are calculated.
10. Results appear automatically.
11. The user puts down another ball.
12. The system resets and becomes READY again.

Accuracy must be benchmarked before any public accuracy claim is made.

---

# 6. V1 — "Real Practice Tool"

## Goal

Turn the working launch-monitor prototype into something a golfer would genuinely use throughout an entire driving-range session.

## Expanded shot data

Add:

- Apex.
- Total distance.
- Offline distance.
- Landing / descent angle.
- Hang time.
- Shot-shape classification.
  - Straight
  - Fade
  - Draw
  - Slice
  - Hook
  - Push
  - Pull

## Session analytics

- Persistent session history.
- Average values.
- Median values.
- Maximum / minimum values.
- Standard deviation / consistency information where useful.
- Filter by club.
- Delete obvious mishits.
- Mark favorite / representative shots.
- Compare individual shots with session averages.

## Dispersion map

Create a top-down map of shot endpoints.

Example:

```text
              TARGET
                 |
          •      |   •
       •         |
             •   | •
-----------------+-----------------
       •         |
               • |   •
                 |
```

Show:

- Left / right dispersion.
- Short / long dispersion.
- Average landing point.
- Optional dispersion ellipse.

## Club statistics

For each club:

- Average carry.
- Average total distance.
- Average ball speed.
- Average launch angle.
- Average offline distance.
- Typical shot shape.
- Dispersion.
- Number of recorded shots.

## Slow-motion replay

- Replay captured impact sequence.
- Ball-tracking overlay.
- Detected trajectory overlay.
- Frame-by-frame mode.
- Display the measurements alongside replay.

## Environmental inputs

Allow the flight model to account for user-entered or available environmental conditions such as:

- Temperature.
- Altitude / elevation.
- Humidity.
- Wind direction.
- Wind speed.

Any automatically acquired environmental data should clearly state its source and timestamp.

## Custom bag

Users can create their bag and enable only clubs they actually carry.

Store optional information such as:

- Club name.
- Club category.
- Loft.
- User nickname.
- Typical carry.

## V1 Navigation

Suggested tabs:

```text
LAUNCH    SESSION    BAG    SETTINGS
```

## V1 Definition of Done

A golfer should be able to spend an entire range session using the app and afterward understand:

- How far each shot carried.
- How fast the ball launched.
- Where shots started.
- Where they finished.
- Overall dispersion.
- Average performance for the selected club.
- Which shots were representative versus obvious mishits.

---

# 7. V2 — "Advanced Launch Monitor"

## Goal

Expand from basic ball-flight measurements into spin and club-delivery information.

These are technically difficult features and should only ship if validation demonstrates acceptable reliability.

## Spin features

Target:

- Backspin.
- Spin axis.
- Side-spin equivalent display.
- Spin confidence.
- Marked-ball mode.

### Marked-ball mode

Allow balls with highly visible alignment marks / patterns to improve rotational tracking.

The UI should identify spin values as either:

```text
MEASURED
ESTIMATED
UNAVAILABLE
```

Never silently substitute an estimate for a failed direct measurement.

## Club tracking

Target measurements:

- Club speed.
- Smash factor.
- Attack angle.
- Club path.
- Face angle.
- Face-to-path.
- Dynamic loft.
- Low-point estimate.
- Impact-location estimate if technically reliable.

### Smash factor

```text
Smash Factor = Ball Speed / Club Speed
```

Do not display smash factor unless both required input measurements meet minimum confidence thresholds.

## Advanced capture quality

- Automatic exposure optimization.
- Motion-blur detection.
- Capture-quality warnings.
- High-speed-mode compatibility checks.
- Per-device performance testing.

## V2 Results Example

```text
DRIVER

CARRY                 267 yd
TOTAL                 284 yd

BALL
Ball Speed          162.7 mph
Launch                13.8°
Backspin            2,340 rpm
Spin Axis             4.2° R
Apex                    94 ft

CLUB
Club Speed          108.5 mph
Smash                  1.50
Attack Angle            +3.1°
Club Path               +1.8°
Face Angle              +2.6°
Face to Path            +0.8°
```

## V2 Definition of Done

V2 is complete when advanced measurements are validated strongly enough that the app can clearly distinguish:

- Reliable measured values.
- Calculated values.
- Estimated values.
- Unavailable / low-confidence values.

---

# 8. V3 — "Two-Camera Precision"

## Goal

Use a second iPhone as another synchronized camera to improve 3D tracking and measurement confidence.

## Device pairing

- Pair Camera 1 and Camera 2.
- Automatic local discovery if practical.
- Simple pairing code / confirmation.
- Show battery and connectivity status for both phones.
- Remote preview of secondary camera.

## Guided placement

Example:

```text
PHONE 1
Behind / offset from golfer
POSITION GOOD ✓

PHONE 2
Down-the-line / alternate angle
POSITION GOOD ✓
```

The final placement geometry must be determined through real-world testing.

## Synchronization

- Estimate / establish timing offset between devices.
- Synchronize capture events.
- Reject shots when synchronization quality is insufficient.

## Multi-view tracking

Potential benefits:

- Improved 3D ball position.
- Improved depth estimation.
- Longer usable tracking window.
- Better cross-checking of detections.
- Improved spin analysis.
- Improved club-head tracking.

## Cross-camera confidence

Compare measurements generated from both views and flag disagreement.

Example:

```text
BALL SPEED
Camera 1: 161.8 mph
Camera 2: 162.4 mph
Combined: 162.1 mph
Confidence: HIGH
```

## V3 Definition of Done

Dual-camera mode must measurably improve one or more validated metrics compared with single-phone mode. It should not exist only as a marketing feature.

---

# 9. V4 — "Golf Practice Platform"

## Goal

Use the launch-monitor engine to build training, bag analysis, and long-term improvement tools.

## Bag gapping mode

Guide the golfer through several shots with every club.

Example flow:

```text
BUILD MY BAG

7 IRON
● ● ● ● ●
5 / 5 COMPLETE

Average Carry
169 YARDS

NEXT: 6 IRON
```

Final output:

```text
58°        82 yd
54°        98 yd
50°       113 yd
PW        128 yd
9I        141 yd
8I        155 yd
7I        169 yd
6I        183 yd
5I        197 yd
4I        209 yd
3H        222 yd
3W        244 yd
DR        271 yd
```

Identify unusual gaps, but avoid pretending there is one universally correct yardage gap for every golfer.

## Training modes

- Random yardage.
- Closest to pin.
- Distance control.
- Wedge matrix.
- Shot-shaping challenge.
- Driver challenge.
- Golf combine.
- Personal-record challenges.

## Random yardage example

```text
TARGET
147 YARDS

CARRY
145 YARDS

OFFLINE
4 YARDS RIGHT

SCORE
94 / 100
```

## Wedge matrix

Track different swing lengths for wedges, for example:

- Quarter swing.
- Half swing.
- Three-quarter swing.
- Full swing.

Save typical carry and dispersion for each combination.

## Long-term analytics

- Carry trends.
- Ball-speed trends.
- Dispersion trends.
- Club consistency.
- Typical miss direction.
- Shot-shape tendencies.
- Personal bests.
- Practice frequency.

## Gamification

Optional features:

- Personal records.
- Practice streaks.
- Achievements.
- Skill scores.

Gamification should not interfere with the core launch-monitor workflow.

---

# 10. V5 — "Simulator & Ecosystem"

## Goal

Expand beyond the phone into a broader golf-simulation and connected-device ecosystem.

## Simulator mode

Possible flow:

```text
iPhone Launch Monitor
        |
        | Local network
        v
Windows PC
        |
        v
Golf Simulation Engine
        |
        v
TV / Monitor / Projector
```

Potential functionality:

- Live shot-data streaming to a PC.
- 3D driving range.
- Virtual greens.
- Indoor hitting mode.
- External display support.
- Simulator-software integration where technically and legally supported.
- Course simulation.

## Multiplayer / social

Potential later features:

- Friends.
- Shared sessions.
- Closest-to-pin competition.
- Long-drive competition.
- Private leaderboards.
- Range games.

## Cloud features

- Account synchronization.
- Session backup.
- Shot-history synchronization.
- Multiple-device support.

Cloud features are intentionally deferred so the initial launch-monitor prototype is not blocked by account / backend work.

---

# 11. Measurement Integrity

Every metric should belong to one of four categories.

## Measured

Directly derived from camera / sensor observations with sufficient confidence.

Example:

```text
BALL SPEED
118.4 MPH
MEASURED
```

## Calculated

Computed from validated measured inputs and a documented physics model.

Example:

```text
CARRY
171 YD
CALCULATED
```

## Estimated

Produced using an inference or model when direct measurement is insufficient.

Example:

```text
BACKSPIN
6,120 RPM
ESTIMATED
```

## Unavailable

The app does not have enough trustworthy information to generate the value.

Example:

```text
SPIN AXIS
UNAVAILABLE
Insufficient ball rotation detail
```

This is preferable to inventing a plausible-looking number.

---

# 12. Measurement Confidence

Each shot should receive an overall measurement-quality score.

Example:

```text
Measurement Quality: 94%

Ball Speed       HIGH
Launch Angle     HIGH
Direction        HIGH
Carry            HIGH
Backspin         MEDIUM
Spin Axis        LOW
```

Potential confidence inputs:

- Number of usable ball detections.
- Detection confidence.
- Motion blur.
- Exposure quality.
- Tracking consistency.
- Camera calibration quality.
- Phone movement.
- Ball leaving frame too quickly.
- Agreement between measurement methods.
- Agreement between cameras in V3.

Exact confidence formulas must be validated rather than chosen arbitrarily.

---

# 13. Recommended App Navigation

## MVP

```text
LAUNCH    SESSION    SETTINGS
```

## V1+

```text
LAUNCH    SESSION    BAG    TRAINING    PROFILE
```

### Launch

Actual launch-monitor capture experience.

### Session

Current and historical shot data, averages, and dispersion.

### Bag

Clubs, typical distances, and gapping.

### Training

Practice games, combines, and structured drills.

### Profile

User preferences, units, handedness, settings, and eventually cloud-account options.

---

# 14. Recommended Repository Structure

Initial structure:

```text
GolfLaunchMonitor/
|
|-- src/
|   |-- app/
|   |   |-- _layout.tsx
|   |   |-- index.tsx
|   |   |-- launch.tsx
|   |   |-- session.tsx
|   |   `-- settings.tsx
|   |
|   |-- components/
|   |   |-- MetricCard.tsx
|   |   |-- ReadyIndicator.tsx
|   |   |-- ShotTracer.tsx
|   |   `-- MeasurementBadge.tsx
|   |
|   |-- features/
|   |   |-- launch/
|   |   |-- sessions/
|   |   |-- clubs/
|   |   |-- trajectory/
|   |   `-- diagnostics/
|   |
|   |-- models/
|   |   |-- Shot.ts
|   |   |-- Club.ts
|   |   `-- Session.ts
|   |
|   |-- physics/
|   |   |-- trajectory.ts
|   |   `-- units.ts
|   |
|   |-- services/
|   |   |-- shotStore.ts
|   |   `-- launchMonitor.ts
|   |
|   |-- theme/
|   |   |-- colors.ts
|   |   |-- spacing.ts
|   |   `-- typography.ts
|   |
|   `-- utils/
|
|-- modules/
|   `-- launch-monitor/
|       |-- ios/
|       |   |-- LaunchMonitorModule.swift
|       |   |-- CameraManager.swift
|       |   |-- HighSpeedCapture.swift
|       |   |-- BallDetector.swift
|       |   |-- BallTracker.swift
|       |   |-- ImpactDetector.swift
|       |   |-- CameraCalibration.swift
|       |   `-- LaunchCalculator.swift
|       `-- src/
|           `-- index.ts
|
|-- assets/
|-- app.json
|-- eas.json
|-- package.json
|-- tsconfig.json
`-- README.md
```

The exact generated structure can change with the Expo SDK. Do not manually create native iOS project files unless the selected Expo workflow requires them.

---

# 15. Windows Development Setup

The project can be developed primarily from Windows using Visual Studio Code.

## Required software

Install:

1. **Visual Studio Code**
2. **Node.js LTS**
3. **Git**
4. **Expo account**
5. **Expo Go on the iPhone** for the first stage of development

Expo's current tutorial explicitly supports Windows as a development machine and lists Node.js LTS and a code editor such as VS Code as prerequisites.

## Recommended VS Code extensions

These are recommendations rather than project requirements:

- ESLint
- Prettier
- GitLens
- Error Lens

Do not install a large number of extensions before they are needed.

---

# 16. Create the Project on Windows

Open PowerShell in the directory where the project should live.

```powershell
npx create-expo-app@latest GolfLaunchMonitor
```

Move into the project:

```powershell
cd GolfLaunchMonitor
```

Open the folder in Visual Studio Code:

```powershell
code .
```

If `code` is not recognized, open VS Code manually and use **File -> Open Folder**.

## Optional: remove the Expo example screens

The default Expo template currently provides a reset script. If the generated project includes it, run:

```powershell
npm run reset-project
```

This is optional. Verify the script exists in `package.json` before running it.

---

# 17. Stage A — Test on the iPhone with Expo Go

This is the fastest development loop and should be used while building:

- App layout.
- Navigation.
- Colors / theme.
- Result cards.
- Session screens.
- Bag screens.
- Settings.
- Physics prototypes that do not require custom native camera code.
- General TypeScript logic.

## Step 1 — Install Expo Go

Install **Expo Go** from the iOS App Store.

Create / sign into an Expo account.

For current physical-iPhone Expo Go testing, Expo requires Expo CLI and Expo Go to be signed into the same Expo account.

## Step 2 — Sign in from Windows

From the project directory:

```powershell
npx expo login
```

Use the same Expo account on the iPhone's Expo Go app.

## Step 3 — Start the development server

```powershell
npx expo start
```

Expo will start the development server and display a QR code.

## Step 4 — Open the app on the iPhone

On the iPhone:

1. Confirm Expo Go is installed and signed into the same Expo account.
2. Open the normal iPhone Camera app.
3. Scan the QR code shown in the Windows terminal.
4. Tap the displayed link.
5. The project should open through Expo Go.

## Normal development loop

```text
Edit code in VS Code
        |
        v
Save file
        |
        v
Expo development server
        |
        v
Physical iPhone updates
```

This allows rapid UI and application-logic iteration without building a new `.ipa` for every TypeScript change.

## Important limitation of Expo Go

Expo Go is intentionally limited. It cannot contain arbitrary custom native Swift code that is unique to this project.

Therefore Expo Go is **not** the final testing environment for the real high-speed launch-monitor engine.

Once the project needs our custom Swift camera module, move to Stage B.

---

# 18. Stage B — Test Native Swift Features on the iPhone

Use a custom **Expo development build** once we begin adding:

- Native Swift code.
- Custom AVFoundation capture.
- High-frame-rate camera controls.
- Native Vision / Core ML processing.
- Custom launch-monitor modules.
- Other native libraries unavailable inside Expo Go.

A development build is our own iPhone app binary containing Expo's development tools plus our native code.

## Requirements

For a physical iPhone development build using the current EAS workflow:

- Active Apple Developer Program membership.
- Expo account.
- EAS CLI.
- Registered iPhone for the development provisioning profile.
- Developer Mode enabled on iOS 16 or later.

## Step 1 — Install EAS CLI

```powershell
npm install --global eas-cli
```

Alternative if global installation is undesirable:

```powershell
npx eas-cli@latest --help
```

If using the `npx` form, substitute `npx eas-cli@latest` for `eas` in later commands.

## Step 2 — Sign into EAS

```powershell
eas login
```

## Step 3 — Install the Expo development client

From the project directory:

```powershell
npx expo install expo-dev-client
```

## Step 4 — Configure EAS Build

```powershell
eas build:configure
```

This creates / updates `eas.json` and connects the local project to EAS.

## Step 5 — Register the iPhone

```powershell
eas device:create
```

Follow the prompts on the iPhone to register it for development provisioning.

## Step 6 — Create the iOS development build

```powershell
eas build --platform ios --profile development
```

The iOS binary is compiled using EAS cloud build infrastructure rather than local Xcode on the Windows PC.

## Step 7 — Install the build on the iPhone

After the EAS build completes:

1. Open the build page / installation link.
2. Use the provided install option or QR code.
3. Install the development build on the registered iPhone.

## Step 8 — Enable Developer Mode

For iOS 16 or later, if Developer Mode is not already enabled:

```text
Settings
-> Privacy & Security
-> Developer Mode
```

Follow the iPhone prompts, including restart / confirmation if requested by iOS.

## Step 9 — Start the Windows development server

Back in the project directory:

```powershell
npx expo start
```

Open the installed **Golf Launch Monitor development build** on the iPhone and connect it to the development server.

Once connected, normal JavaScript / TypeScript edits can still update through the development server.

### Native-code rebuild rule

If we change Swift code or add / change a library that contains native code, a new development binary may be required before those native changes can run on the phone.

That means the native workflow becomes:

```text
Edit Swift / native configuration
        |
        v
Commit / save changes
        |
        v
EAS development build
        |
        v
Install new development build
        |
        v
Test on physical iPhone
```

JavaScript / TypeScript-only changes generally do not require rebuilding the native binary as long as the installed development build already contains all required native dependencies.

---

# 19. Create the Native Launch-Monitor Module

When the MVP reaches the native-camera stage, create a local Expo module inside the app:

```powershell
npx create-expo-module@latest --local
```

Use a name such as:

```text
launch-monitor
```

The local module should contain the Swift implementation of performance-critical iOS functionality.

Conceptual API:

```ts
export interface LaunchResult {
  ballSpeedMph: number;
  launchAngleDeg: number;
  launchDirectionDeg: number;
  confidence: number;
}

const result = await LaunchMonitor.captureShot();
```

The TypeScript UI should not need to understand individual raw camera frames. The native engine should return structured measurements and diagnostic information.

---

# 20. Native Module Responsibilities

Suggested Swift components:

## `CameraManager.swift`

Responsibilities:

- Discover supported iPhone cameras.
- Select capture device.
- Configure capture session.
- Manage permissions.
- Lock / manage appropriate camera settings.

## `HighSpeedCapture.swift`

Responsibilities:

- Inspect supported formats and frame rates.
- Configure the selected high-speed capture mode.
- Receive timestamped frame buffers.
- Maintain capture / rolling buffer strategy.

## `CameraCalibration.swift`

Responsibilities:

- Store camera geometry information.
- Handle coordinate conversions.
- Support real-world measurement calculations.

## `BallDetector.swift`

Responsibilities:

- Detect ball candidates.
- Return center, size, and confidence.
- Reject obvious false detections.

## `ImpactDetector.swift`

Responsibilities:

- Determine when a shot occurs.
- Combine available visual / audio evidence if useful.
- Trigger preservation of the relevant frame window.

## `BallTracker.swift`

Responsibilities:

- Associate ball detections across frames.
- Generate timestamped image-space / reconstructed positions.
- Detect tracking failure.

## `LaunchCalculator.swift`

Responsibilities:

- Fit the initial trajectory.
- Estimate the initial velocity vector.
- Calculate ball speed.
- Calculate launch angle.
- Calculate launch direction.
- Generate uncertainty / confidence data.

## `LaunchMonitorModule.swift`

Responsibilities:

- Expose a clean native API to React Native / Expo.
- Start / stop monitoring.
- Emit state changes.
- Return shot measurements.
- Return diagnostic information.

---

# 21. Suggested MVP Engineering Milestones

## MVP 0.1 — App shell

Deliver:

- Expo project.
- Blue / green / white theme.
- Navigation shell.
- Launch screen mockup.
- Session screen mockup.
- Settings screen.

Test using Expo Go.

### Done when

The app opens on the physical iPhone and the main navigation is stable.

---

## MVP 0.2 — Simulated shots

Create fake shot data so the entire interface can be built before the camera system exists.

Example:

```json
{
  "club": "7 Iron",
  "ballSpeedMph": 118.4,
  "launchAngleDeg": 17.6,
  "launchDirectionDeg": 1.4,
  "carryYards": 171,
  "confidence": 0.92
}
```

Deliver:

- Shot result cards.
- Shot tracer prototype.
- Session shot list.
- Unit conversion.
- Measurement badges.

### Done when

The entire user experience can be demonstrated with simulated shot data.

---

## MVP 0.3 — Ball-flight physics prototype

Deliver:

- Basic trajectory engine.
- Gravity.
- Initial aerodynamic model.
- Carry calculation.
- Apex calculation internally, even if not yet shown in MVP UI.
- Deterministic automated tests for known inputs.

### Done when

The same launch parameters always produce the same reproducible trajectory and results.

This model will later require calibration / validation against real golf-ball flight.

---

## MVP 0.4 — Native development build

Deliver:

- `expo-dev-client` installed.
- EAS project configured.
- Physical iPhone registered.
- Development build installed on the iPhone.
- Local Expo native module created.
- Simple Swift -> TypeScript test method working.

Example proof:

```text
Swift returns: "Launch monitor native module online"
React Native displays it on screen.
```

### Done when

Windows -> EAS -> iPhone native-development workflow is repeatable.

---

## MVP 0.5 — Native camera pipeline

Deliver:

- Camera permission flow.
- Native preview / capture pipeline.
- Supported format / FPS discovery.
- Diagnostic readout.
- Capture frames with stable timestamps.

### Done when

The selected iPhone can repeatedly enter the intended camera mode and produce diagnostic capture information without crashing.

---

## MVP 0.6 — Ball detection

Deliver:

- Golf-ball detection inside a defined hitting zone.
- Detection confidence.
- Stable-ball requirement.
- Ball overlay.
- READY state.

### Done when

The app can reliably distinguish:

```text
NO BALL
BALL FOUND
READY
```

under expected range conditions.

---

## MVP 0.7 — Impact + post-impact tracking

Deliver:

- Automatic shot trigger.
- Preservation of relevant frames.
- Track the ball after impact.
- Store timestamped positions.
- Reject obviously failed tracks.

### Done when

A real golf shot consistently produces a usable sequence of tracked ball positions.

---

## MVP 0.8 — Launch measurements

Deliver:

- Ball speed.
- Launch angle.
- Launch direction.
- Confidence / quality output.

### Done when

Measurements are repeatable and can be exported for validation.

---

## MVP 0.9 — Validation

Test simultaneous shots against a trusted commercial launch monitor.

For every test shot, record:

```text
Shot ID
Club
Reference ball speed
App ball speed
Reference launch angle
App launch angle
Reference launch direction
App launch direction
Reference carry
App calculated carry
App confidence
Lighting
Phone model
Phone placement
Notes
```

Calculate:

- Absolute error.
- Mean absolute error.
- Bias.
- Standard deviation of error.
- Failure / no-read rate.
- Error versus confidence score.

### Done when

We know what the app actually does well and where it fails.

Do **not** publish an accuracy claim before this milestone.

---

## MVP 1.0 — Integrated launch monitor

Deliver the complete automatic loop:

```text
BALL FOUND
   ->
READY
   ->
SHOT
   ->
CAPTURE
   ->
MEASURE
   ->
SIMULATE
   ->
RESULTS
   ->
RESET
```

---

# 22. Testing Strategy

## Unit tests

Use for:

- Unit conversions.
- Physics calculations.
- Coordinate math.
- Statistics.
- Session aggregation.
- Confidence calculations where deterministic.

## Recorded-data tests

Store representative captured data so algorithm changes can be tested against known shots without physically hitting a ball every time.

## Physical-device tests

Test across:

- Bright outdoor range.
- Overcast outdoor range.
- Indoor hitting bay.
- Artificial lighting.
- Different backgrounds.
- Different ball markings.
- Multiple iPhone models where available.

## Comparison testing

Reference launch-monitor testing should be considered part of engineering, not merely a final marketing test.

---

# 23. Source Control

Use Git from the beginning.

Recommended initial workflow:

```powershell
git status
git add .
git commit -m "Describe the change"
```

Suggested branches once multiple features are being developed:

```text
main
feature/ui-launch-screen
feature/trajectory-engine
feature/native-camera
feature/ball-detection
feature/session-analytics
```

Avoid large unrelated changes in a single commit.

---

# 24. What We Are Not Building First

The following should **not** block the MVP:

- User accounts.
- Cloud backend.
- Social feed.
- Multiplayer.
- Subscriptions.
- AI swing coach.
- Course simulator.
- Exact club-model recognition.
- Spin claims that have not been validated.
- Club-data claims that have not been validated.

The MVP exists to answer one question:

> Can the iPhone automatically and reliably measure enough of the initial golf-ball launch to create a useful launch-monitor experience?

Everything else comes after that.

---

# 25. Current Known Limitations / Unknowns

This project is still in the planning stage.

The following cannot yet be confirmed and require physical prototyping and validation:

- Achievable ball-speed accuracy.
- Achievable launch-angle accuracy.
- Achievable launch-direction accuracy.
- Minimum usable lighting conditions.
- Number of usable post-impact frames at different ball speeds.
- Whether unmarked-ball spin can be directly measured reliably on supported iPhones.
- Whether marked-ball spin can be measured accurately enough for production use.
- Whether club-head speed / path / face can be measured reliably from the chosen camera position.
- Which iPhone models will meet the eventual minimum hardware requirements.
- Whether dual-iPhone mode provides enough improvement to justify its complexity.

These questions should be treated as engineering experiments, not assumptions.

---

# 26. Development Workflow at a Glance

## Early development

```text
Windows PC
   |
   | VS Code
   v
React Native / Expo
   |
   | npx expo start
   v
iPhone + Expo Go
```

Use for UI, navigation, simulated shots, sessions, basic physics prototypes, and general application logic.

## Native launch-monitor development

```text
Windows PC + VS Code
        |
        | source code
        v
Expo / EAS Build
        |
        | cloud iOS build
        v
Signed iOS development build
        |
        v
Physical iPhone
        |
        | connects to Metro / Expo dev server
        v
Windows development loop
```

Use for custom Swift, AVFoundation, Vision / Core ML, high-speed capture, and real shot measurement.

---

# 27. Official Development References

The setup instructions above were checked against current Expo documentation on **October 5, 2026**.

- Expo — Create a project:  
  https://docs.expo.dev/get-started/create-a-project/

- Expo — Create your first app / Windows + physical-device workflow:  
  https://docs.expo.dev/tutorial/create-your-first-app/

- Expo — Set up an iOS development build:  
  https://docs.expo.dev/get-started/set-up-your-environment/?device=physical&mode=development-build&platform=ios

- Expo — Create and run a cloud iOS development build:  
  https://docs.expo.dev/tutorial/eas/ios-development-build-for-devices/

- Expo — Development builds:  
  https://docs.expo.dev/develop/development-builds/use-development-builds/

- Expo — Add custom native code:  
  https://docs.expo.dev/workflow/customizing/

- Expo — Create a local native module:  
  https://docs.expo.dev/more/create-expo-module/

- Expo — iOS Developer Mode:  
  https://docs.expo.dev/guides/ios-developer-mode/

- Expo — Local compilation requirements:  
  https://docs.expo.dev/guides/local-app-development/

---

# 28. Immediate Next Step

Start with **MVP 0.1**.

Initial objective:

> Create the Expo project on Windows, open it in Visual Studio Code, launch it on the physical iPhone using Expo Go, and build the first blue / green / white Launch screen.

Once that works, proceed to **MVP 0.2** and build the complete results / session experience using simulated shot data before introducing native camera complexity.

---

## Project Principle

**Build the measurement engine first. Earn the advanced features with validated data.**
