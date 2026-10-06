# PinPoint MVP — Windows + VS Code + iPhone Setup

This guide is specifically for developing PinPoint on a Windows PC and testing the real native launch-monitor code on an iPhone.

## 1. Requirements

### Windows PC
Install:
- Git
- Visual Studio Code
- Node.js **22.13 or newer** for Expo SDK 57.
- An Expo account.
- EAS CLI.

### iPhone
- iOS 16.4 or later is the minimum target configured for this project.
- A physical iPhone is required for the real camera tests.
- Developer Mode must be enabled after the development build is installed.

### Apple
A physical iPhone development build through the EAS/ad-hoc workflow requires an active Apple Developer Program membership.

## 2. Unzip and open the project

Example:

```powershell
cd C:\Users\YOUR_NAME\Documents
Expand-Archive .\PinPoint_MVP.zip .\PinPoint_MVP
cd .\PinPoint_MVP\PinPoint
code .
```

If you are applying the package to the GitHub repository instead, copy the contents of the `PinPoint` folder into your local clone of `TheMime3/PinPoint`.

## 3. Install JavaScript dependencies

In the VS Code terminal:

```powershell
npm install
npx expo install --fix
npx expo-doctor
```

`expo install --fix` aligns Expo SDK dependencies with the installed SDK.

Do not continue to the EAS build if `expo-doctor` reports a dependency problem you have not understood.

## 4. Install / sign into EAS

```powershell
npm install --global eas-cli
eas login
```

Use the Expo account you want associated with PinPoint.

## 5. Link / configure the EAS project

Run:

```powershell
eas build:configure
```

Choose iOS (or All if you want).

The ZIP already contains `eas.json`; EAS may add project metadata such as an Expo project ID to `app.json`.

### Bundle identifier

The package starts with:

```text
com.themime3.pinpoint
```

If Apple or EAS tells you this identifier is unavailable, change `expo.ios.bundleIdentifier` in `app.json` to another identifier owned by your Apple Developer account, for example:

```text
com.themime3.pinpointgolf
```

## 6. Register your iPhone

Run:

```powershell
eas device:create
```

Choose the website/URL registration method when prompted.

Open the generated URL on the iPhone and follow the registration steps.

## 7. Build PinPoint for the physical iPhone

Run:

```powershell
eas build --platform ios --profile development
```

EAS builds the native iOS application on macOS infrastructure. This build includes:
- Expo development client.
- PinPoint's custom Swift module.
- AVFoundation camera code.
- Core Motion orientation code.

The first build may prompt you for Apple Developer credentials/signing configuration.

## 8. Install the build on the iPhone

When EAS finishes:
1. Open the EAS build link on the iPhone or scan the provided QR code.
2. Install PinPoint.
3. If iOS asks you to trust/confirm the development installation, follow its prompts.

## 9. Enable Developer Mode

On iOS 16+:

```text
Settings
> Privacy & Security
> Developer Mode
```

Turn it on and follow the restart/confirmation prompts.

## 10. Start the development server on Windows

From the PinPoint project directory:

```powershell
npm start
```

This runs:

```text
expo start --dev-client
```

Make sure:
- Windows PC and iPhone are on the same local network.
- Windows Firewall allows Node/Expo/Metro on private networks.

Open the installed **PinPoint** development build on the iPhone and select/connect to the development server.

If LAN discovery fails, try:

```powershell
npx expo start --dev-client --tunnel
```

The tunnel is useful for JavaScript delivery. Native camera code is already inside the installed binary.

## 11. Camera permission

The first time the native Launch screen starts, iOS should request camera permission.

Choose **Allow**.

If permission was previously denied:

```text
iPhone Settings
> Apps
> PinPoint
> Camera
> On
```

## 12. First physical MVP test

Use a tripod or stable mount.

Start with:
- Portrait phone orientation.
- Rear camera.
- Approximately 6–8 ft behind the ball.
- Approximately aligned with the target line.
- Rear camera about 24–36 in above the hitting surface.
- Good, even lighting.
- A normal white golf ball on a background with useful contrast.

Open PinPoint and complete the setup guide.

The expected state progression is:

```text
SEARCHING FOR BALL
BALL FOUND
CALIBRATING
READY
CAPTURING
PROCESSING
SHOT COMPLETE
```

### If auto detection cannot lock the ball

Tap **MANUAL BALL LOCK**, then tap directly on the ball in the camera view.

Manual lock does not bypass tracking; it changes the starting search location.

## 13. Diagnostics

Open:

```text
Settings
```

Long-press **PinPoint MVP 0.1** near the bottom.

A `DIAG` tab appears.

Watch:
- Camera FPS.
- Resolution.
- Shutter / exposure.
- Ball detection confidence.
- Frames tracked.
- Tracking confidence.
- Roll / pitch.
- Calibration.
- Lighting.
- Measurement quality.
- Processing time.

## 14. Important native rebuild rule

Normal TypeScript / React Native changes:

```text
Edit in VS Code
> Save
> Metro updates the iPhone
```

Changes to any Swift file inside:

```text
modules/pinpoint-launch-monitor/ios/
```

require a new native EAS development build:

```powershell
eas build --platform ios --profile development
```

Install the new build before testing the Swift change.

## 15. Expo Go test mode

If you only want to inspect the UI before creating a paid Apple development build:

```powershell
npx expo start
```

Open the project in Expo Go.

The custom launch-monitor Swift module will be unavailable. PinPoint will show a warning and offer **GENERATE DEMO SHOT**.

Expo Go is not a test of the real camera engine.

## 16. Push to GitHub

After you have copied this package into your local clone:

```powershell
git status
git add .
git commit -m "Build PinPoint MVP launch monitor"
git push origin main
```

If you prefer feature branches:

```powershell
git switch -c feature/mvp-launch-monitor
git add .
git commit -m "Build PinPoint MVP launch monitor"
git push -u origin feature/mvp-launch-monitor
```

Then merge through GitHub after physical-device testing.
