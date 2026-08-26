# Instalación

## Antes de empezar

Necesitas:

- Windows 10 o Windows 11
- Python 3.12 o más reciente si quieres ejecutar desde el código fuente
- Un navegador en el teléfono conectado a la misma red Wi-Fi local que el PC

## Opción 1: ejecutar desde el código fuente

1. Abre una terminal en la carpeta del proyecto.
2. Instala las dependencias:

```powershell
pip install -r requirements.txt
```

3. Inicia la aplicación:

```powershell
python main.py
```

4. Abre en el teléfono la dirección local que muestra la aplicación en la bandeja del sistema.

## Opción 2: usar la versión empaquetada

1. Genera el paquete de Windows:

```powershell
.\scripts\build_windows.ps1
```

2. Inicia `BouRemoteServ.exe` desde `dist\BouRemoteServ\`.
3. Abre la dirección local o escanea el código QR que aparece en el panel.

## Primer arranque

- Asegúrate de que el PC y el teléfono estén en la misma red Wi-Fi.
- Permite BouRemoteServ en el Firewall de Windows si aparece una solicitud.
- Usa el código QR del panel para conectarte más rápido.
- Deja la app de la bandeja abierta para que el teléfono pueda reconectarse después.
