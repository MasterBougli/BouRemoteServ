# Installation

## Before you start

You need:

- Windows 10 or Windows 11
- Python 3.12 or newer if you want to run from source
- A phone browser connected to the same local Wi-Fi network as the PC

## Option 1: Run from source

1. Open a terminal in the project folder.
2. Install the dependencies:

```powershell
pip install -r requirements.txt
```

3. Start the app:

```powershell
python main.py
```

4. Read the local address shown by the tray app and open it on your phone.

## Option 2: Use the packaged build

1. Build the Windows package:

```powershell
.\scripts\build_windows.ps1
```

2. Launch the generated `BouRemoteServ.exe` from `dist\BouRemoteServ\`.
3. Open the local address or scan the QR code displayed in the dashboard.

## First launch checklist

- Keep the PC and phone on the same Wi-Fi network.
- Allow BouRemoteServ through Windows Firewall if you are prompted.
- Use the dashboard QR code for the fastest connection.
- Keep the tray app running so the phone can reconnect later.
