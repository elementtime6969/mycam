# MYCAM

Official downloads and support for MYCAM on Android, Windows PC Studio and supported jailbroken iPhones.

By downloading or using MYCAM, you agree to the [MYCAM Terms of Use](TERMS.md).

## Download

[Download MYCAM v2.28.9](https://github.com/elementtime6969/mycam/releases/latest/download/Mycam-v2.28.9.apk)

Non-root engine users must also install the third-party helper that powers the non-root setup:

[Download MOCHI helper](https://raw.githubusercontent.com/elementtime6969/mycam/main/downloads/MOCHI.apk)

## Windows PC Studio

**[Download MYCAM PC Studio v1.0.0 for Windows](https://github.com/elementtime6969/mycam/releases/download/pc-v1.0.0/MYCAM-PC-Setup-1.0.0-x64.exe)**

Run this single setup `.exe`. After you accept the terms, it automatically downloads and SHA-256-verifies the remaining components, installs the camera interfaces and creates Start menu and desktop shortcuts. Do not download or unpack the component ZIP files yourself.

- Windows 11 x64, administrator access and internet required. Allow 12 GB free during installation.
- Local neural portrait processing requires supported NVIDIA CUDA hardware.
- Activate with a valid MYCAM key or purchase access inside the app. Feature and voice-account limits still apply.
- This release is not Authenticode publisher-signed; Windows may show an unknown-publisher warning. Verify the official release and checksums before installing.

[Windows tutorial](https://youtu.be/7yKQAaP4SZ0?si=lLMXI89LKjY_VblE) · [Windows release and SHA-256 checksums](https://github.com/elementtime6969/mycam/releases/tag/pc-v1.0.0)

The application source code and signing keys are not included. Use only authorized media; never use MYCAM to bypass age, identity or liveness verification.

## Hinge Auto

Hinge Auto is available as a companion download for MYCAM users. If you already have an active MYCAM subscription on your phone, you can use Hinge Auto for free with the same subscription access.

[Download Hinge Auto v1.3](https://raw.githubusercontent.com/elementtime6969/mycam/main/downloads/HingeAuto-v1.3.apk)

Scroll down to learn more about MYCAM modes and OBS setup.

## MYCAM iOS for Sileo

Jailbroken iPhone users can install MYCAM iOS and receive future package updates through the official Sileo repository:

**[Add the MYCAM iOS repository to Sileo](https://shareswhatyoucan.com/mycam/)**

Sileo source: `https://elementtime6969.github.io/mycam/sileo/`

## Ready Rooted Phone From Us

**Buy a full rooted phone from us if you want MYCAM ready without doing the device setup yourself.** Open MYCAM and submit a rooted phone request with your model, country, shipping details and phone photo. We review availability, pricing and shipping, then reply in your private MYCAM order thread.

![Ready rooted phone for MYCAM setup](docs/assets/rooted-phone-ad.png)

## What MYCAM Does

MYCAM replaces the normal Android camera feed inside supported apps. It hooks into Android Camera1 and Camera2 flows, including preview, capture session, and ImageReader paths, so a selected target app can receive controlled virtual camera video instead of the physical camera feed.

MYCAM can swap the live camera during calls or camera sessions with:

- Pre-recorded video from the phone.
- Local media selected inside MYCAM.
- OBS livestream video through Live RTMP.
- A local MediaMTX server running on the same private Wi-Fi network.

Supported workflows include:

- **Standalone engine** for MYCAM setup directly on rooted Android phones.
- **MYCAM Legacy LSPosed mode** for users who enable MYCAM through LSPosed.
- **Non-root engine** with the required MOCHI helper APK for supported non-root setups.
- **Video mode** for selected clips.
- **Photo mode** for selected images.
- **Live RTMP** for OBS-to-phone streaming.
- **Watch mode** to keep MYCAM ready when the target app opens the camera.
- **Remote controls** for swap, play/pause, reload, freeze/unfreeze, speed, mute, previous, and next.
- **Clone mode** for creating separated supported social app profiles for accounts you own.
- **Android ID changer** for testing, app-profile isolation, and supported cloned app environments.

MYCAM is designed for supported camera apps and social media apps that use Android camera APIs, including Instagram, WhatsApp, WhatsApp Business, Messenger, TikTok, Telegram, Snapchat, Facebook, and other supported apps that open the Android camera.

Use MYCAM only with your own accounts, devices, and content, and follow the rules of the apps and platforms you use.

## Use Cases

### Control MYCAM While A Target App Is Active

Use MYCAM Remote to swap media, pause or play, reload, freeze or unfreeze, change speed, mute, and move between clips while the selected target app is using the virtual camera.

![MYCAM remote controls with Live RTMP and WhatsApp selected](docs/assets/mycam-app-remote.jpg)

### Replace A Live Call Camera With Pre-recorded Video

MYCAM can hook the target app camera during a live call or camera session and swap the physical camera feed with selected pre-recorded video, local media, or OBS RTMP output.

![WhatsApp live call using MYCAM virtual camera video and remote controls](docs/assets/mycam-whatsapp-call.jpg)

## Current Version

| Field | Value |
| --- | --- |
| App | MYCAM |
| Package | `com.destiny.mycam` |
| Version | `2.28.9` |
| Version code | `70` |
| APK file | `Mycam-v2.28.9.apk` release asset |
| APK size | `151,611,134` bytes |
| Published | `2026-09-23` |

## Requirements

- A rooted Android phone for standalone and MYCAM Legacy LSPosed modes, or a supported non-root Android setup with the MOCHI helper.
- Install the current MYCAM APK.
- Use the standalone engine, or use MYCAM Legacy LSPosed mode for LSPosed setups.
- Select and prepare the target app inside MYCAM.
- Live RTMP requires the MYCAM Windows tools package when streaming from OBS.

## Install

1. Download the APK from the link above.
2. Open the APK on your Android device.
3. If Android asks, allow installs from the browser or file manager you used.
4. For non-root engine setup, install the [MOCHI helper](https://raw.githubusercontent.com/elementtime6969/mycam/main/downloads/MOCHI.apk).
5. Follow the [MYCAM standalone setup tutorial](https://youtu.be/57yzC7uYvX0?is=32Vgl2QqTEK6dMv6), the [MYCAM Legacy LSPosed tutorial](https://youtu.be/dzsUGq8qy1Y?si=q0GkRN_WRSyMR5h4), or the [non-rooted Android tutorial](https://youtu.be/N-sgR6y6h9s?is=lj3b_pDY7KCkOEXu).
6. Open MYCAM after installation.

MYCAM uses a server-side update and integrity gate. First launch requires internet so the app can verify the official build.

## Live RTMP Tools

Live RTMP support uses a companion Windows tools package with the local media server files and OBS setup needed for optional livestreaming from OBS to MYCAM.

- Tools download: [Download MYCAM Live RTMP tools](https://github.com/elementtime6969/mycam/releases/download/v2.25.7/tools.rar)
- OBS tutorial: [For OBS LIVE STREAMING TUTORIAL WATCH IT](https://youtu.be/4k45NKvzP4k?is=LY8h0Eux9Xc-1cVY)
- Setup guide: [MYCAM Live RTMP setup](docs/live-rtmp-setup.md)

## Support And Comments

Use [GitHub Issues](https://github.com/elementtime6969/mycam/issues) for comments, bug reports, and download problems.

## Repository Policy

This repository is for official MYCAM downloads, Live RTMP setup documentation, and user comments only. The MYCAM source code is not published here, and code contributions are not accepted.
