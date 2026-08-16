# MYCAM

Official download and support page for MYCAM, a standalone Android virtual camera tool for rooted phones.

By downloading or using MYCAM, you agree to the [MYCAM Terms of Use](TERMS.md).

## Download

[Download MYCAM v2.9.19](https://github.com/elementtime6969/mycam/releases/latest/download/Mycam-v2.9.19.apk)

Scroll down to learn more about MYCAM and OBS setup ↓

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
| Version | `2.9.19` |
| Version code | `38` |
| APK file | `downloads/Mycam-v2.9.19.apk` |
| APK size | `81,920,472` bytes |
| Published | `2026-08-16` |

## Requirements

- A rooted Android phone.
- Install the standalone MYCAM APK.
- Select and prepare the target app inside MYCAM.
- Live RTMP requires the MYCAM Windows tools package when streaming from OBS.

## Install

1. Download the APK from the link above.
2. Open the APK on your Android device.
3. If Android asks, allow installs from the browser or file manager you used.
4. Follow the [new MYCAM standalone setup tutorial](https://youtu.be/57yzC7uYvX0?is=32Vgl2QqTEK6dMv6).
5. Open MYCAM after installation.

MYCAM uses a server-side update and integrity gate. First launch requires internet so the app can verify the official build.

## Live RTMP Tools

Live RTMP support uses a companion Windows tools package with the local media server files and OBS setup needed for optional livestreaming from OBS to MYCAM.

- Setup guide: [MYCAM Live RTMP setup](docs/live-rtmp-setup.md)

## Support And Comments

Use [GitHub Issues](https://github.com/elementtime6969/mycam/issues) for comments, bug reports, and download problems.

## Repository Policy

This repository is for official MYCAM downloads, Live RTMP setup documentation, and user comments only. The MYCAM source code is not published here, and code contributions are not accepted.
