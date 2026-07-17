# MYCAM Live RTMP Setup

Live RTMP support lets MYCAM use a local RTMP video stream from OBS as the camera video source for a selected target application. This is optional and intended for users who want to livestream from OBS to MYCAM on the same private Wi-Fi network.

Download the tools package from the GitHub Release page:

[MYCAM-Live-RTMP-tools.rar](https://github.com/elementtime6969/mycam/releases/download/live-rtmp-tools-v2/MYCAM-Live-RTMP-tools.rar)

Extract the archive to a folder on your Windows PC before starting.

## 1. Start The Local Media Server

Double-click `START-MYCAM-SERVER.cmd` and leave its window open. Windows may ask for firewall access; allow access on private networks.

## 2. Configure OBS

Open **Settings -> Stream** in OBS and enter:

| Field | Value |
| --- | --- |
| Service | `Custom` |
| Server | `rtmp://127.0.0.1:1935/live` |
| Stream key | `mycam` |

Recommended output settings for the first test:

| Setting | Recommendation |
| --- | --- |
| Encoder | H.264 hardware encoder when available |
| Resolution | `720x1280` portrait, or `1280x720` landscape |
| Frame rate | `30 FPS` |
| Keyframe interval | `2 seconds` |
| Bitrate | `2500-4500 Kbps` |

Click **Start Streaming** in OBS.

## 3. Activate Live RTMP In MYCAM

1. Put the phone and computer on the same Wi-Fi network.
2. Select the target application in MYCAM.
3. Tap **Live RTMP**.
4. Tap **Find Server**. MYCAM scans the local Wi-Fi network and fills in the MediaMTX address automatically.
5. If automatic discovery is unavailable, enter one of the addresses printed by `START-MYCAM-SERVER.cmd`, for example `rtmp://192.168.1.50:1935/live/mycam`.
6. Tap **Activate Live**, then open the target application's camera.

MYCAM stores one shared server address and automatically reuses it for every target application.

The phone microphone remains the audio source. MYCAM Live RTMP currently supplies the camera video.

## Troubleshooting

- If the phone cannot connect, allow `mediamtx.exe` through Windows Firewall on private networks.
- Do not use `127.0.0.1` in MYCAM; that address would point to the phone itself.
- Check that OBS is streaming before opening the target camera.
- Avoid guest Wi-Fi networks, which often block devices from communicating with each other.
- Keep the server private. This configuration accepts publishing only from the same PC and reading only from private-network addresses.

