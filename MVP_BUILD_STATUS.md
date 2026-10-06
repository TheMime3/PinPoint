# PinPoint MVP Build Status

## Package status

**Code package:** Implemented  
**TypeScript / TSX syntax parse:** Passed  
**Swift syntax parse:** Passed with Swift 6.2 parser  
**npm dependency installation in the build environment:** Not completed because the environment could not reach/install npm dependencies within the available execution window  
**EAS / Xcode iOS compile:** Not run here  
**Physical iPhone camera test:** Not run here  
**Launch-monitor accuracy benchmark:** Not run

Because the last three items require Apple tooling and/or a physical iPhone, this document does **not** claim the MVP Definition of Done has been met yet.

## Feature implementation matrix

| Requirement | Code included | Physical validation still required |
|---|---:|---:|
| Live camera view | Yes | Yes |
| Guided positioning screen | Yes | Yes |
| Ball target zone | Yes | Yes |
| Roll / pitch indicator | Yes | Yes |
| Lighting indicator | Yes | Yes |
| Camera permission handling | Yes | Yes |
| Automatic calibration flow | Yes | Yes |
| Manual calibration / ball lock | Yes | Yes |
| Golf-ball detection | Yes, experimental bright-ball detector | Yes |
| Ball overlay | Yes | Yes |
| Detection confidence | Yes | Yes |
| Stable detection before READY | Yes | Yes |
| Automatic shot trigger | Yes, visual displacement/loss trigger | Yes |
| Rolling impact buffer | Yes; a small retained raw-frame ring surrounds impact for native experimentation | Yes |
| Post-impact tracking | Yes | Yes |
| Frame timestamp | Yes | Yes |
| Center X/Y | Yes | Yes |
| Apparent size | Yes | Yes |
| Detection confidence | Yes | Yes |
| Camera geometry/focal estimate | Yes | Yes |
| Ball speed | Yes, native calculation | Yes |
| Launch angle | Yes, native calculation | Yes |
| Launch direction | Yes, native calculation | Yes |
| Carry | Yes, experimental flight model | Yes |
| Projected trajectory | Yes | Yes |
| Shot tracer | Yes | Yes |
| Automatic results | Yes | Yes |
| Manual club selection | Yes | No hardware validation needed |
| Active session history | Yes, local persistence | App test required |
| Diagnostics mode | Yes | Yes |
| Automatic re-arm | Yes | Yes |

## Rolling impact buffer

The native camera view keeps a deliberately small retained frame ring around impact (up to 6 pre-impact frames and 10 immediate post-impact frames). The MVP does not expose those frames as replay video yet; they are retained during capture/processing so the native algorithm can be extended and debugged without committing to a large-memory replay implementation.

## Shot trigger

The current experimental trigger is **visual**:
- armed ball disappears for consecutive frames,
- ball center moves beyond the stable-lock threshold, or
- apparent ball size changes rapidly.

Audio and explicit club-head motion are not used in this build. The trigger selection must be validated experimentally, as required by the MVP specification.

## Definition-of-Done gate

Do not mark MVP complete until `VALIDATION_CHECKLIST.md` has been run on the physical iPhone and the automatic loop succeeds repeatedly.
