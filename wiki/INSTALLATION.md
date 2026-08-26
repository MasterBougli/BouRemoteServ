# Installation

## Before you start

You need:

- Windows 10 or Windows 11
- Python 3.12 or newer if you run from source
- A phone browser on the same local Wi-Fi network as the PC

## Run from source

1. Open a terminal in the project folder.
2. Install the dependencies:

```powershell
pip install -r requirements.txt
```

3. Start the app:

```powershell
python main.py
```

4. Open the local address shown by the tray app on your phone.

## Use the packaged build

1. Build the Windows package:

```powershell
.\scripts\build_windows.ps1
```

2. Launch `BouRemoteServ.exe` from `dist\BouRemoteServ\`.
3. Open the local address or scan the QR code from the dashboard.
