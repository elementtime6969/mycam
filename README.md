# MYCAM

Official download and support page for MYCAM, an Android virtual camera tool with standalone, Legacy LSPosed and supported non-root engine modes.

By downloading or using MYCAM, you agree to the [MYCAM Terms of Use](TERMS.md).

## Download

[Download MYCAM v2.20.0](https://raw.githubusercontent.com/elementtime6969/mycam/main/downloads/Mycam-v2.20.0.apk)

Non-root engine users must also install the third-party helper that powers the non-root setup:

[Download MOCHI helper](https://raw.githubusercontent.com/elementtime6969/mycam/main/downloads/MOCHI.apk)

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
| Version | `2.20.0` |
| Version code | `48` |
| APK file | `downloads/Mycam-v2.20.0.apk` |
| APK size | `94,544,418` bytes |
| Published | `2026-08-30` |

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

- Setup guide: [MYCAM Live RTMP setup](docs/live-rtmp-setup.md)

## Support And Comments

Use [GitHub Issues](https://github.com/elementtime6969/mycam/issues) for comments, bug reports, and download problems.

## Repository Policy

This repository is for official MYCAM downloads, Live RTMP setup documentation, and user comments only. The MYCAM source code is not published here, and code contributions are not accepted.
