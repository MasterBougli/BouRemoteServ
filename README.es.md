# BouRemoteServ

**Idioma:** [English](README.md) | [Français](README.fr.md) | [Español](README.es.md)

BouRemoteServ es una aplicación Windows discreta en la bandeja del sistema que expone una interfaz web local para controlar tu PC desde el teléfono, sin instalar nada en el teléfono.

## Versión

- Estado actual: `No publicado`
- Changelog: [changelog.md](changelog.md)
- Todavía no existe ninguna release etiquetada

## Lo que hace

- Mover el ratón desde un panel táctil en el teléfono
- Hacer pequeños ajustes con un pad direccional
- Lanzar `Play / Pause`, `Next` y `Previous`
- Mantenerse discreto en la barra de tareas de Windows
- Iniciarse manualmente o con Windows
- Cambiar la interfaz entre francés e inglés
- Conectarse por dirección local o por código QR

## Por qué esta base

- Windows primero, como pediste
- El teléfono usa solo el navegador
- Solo red local, sin dependencia de la nube
- Una app en la bandeja que se siente nativa y discreta
- Una sola interfaz responsive para teléfono y escritorio

## Estructura

- `main.py` inicia la app de bandeja y el servidor local
- `remote_dock/` contiene la lógica de control de Windows
- `web/` contiene la interfaz responsive enfocada en móvil
- `docs/` contiene las guías de instalación y uso
- `scripts/` contiene las utilidades de build para Windows

## Inicio rápido

1. Instala las dependencias.
2. Ejecuta `python main.py`.
3. Abre en tu teléfono la dirección local que se muestra.
4. Usa el código QR o la dirección manual para conectarte.

## Ejecutar en local

1. Instala Python 3.12 o más reciente.
2. Instala las dependencias:

```powershell
pip install -r requirements.txt
```

3. Inicia la app:

```powershell
python main.py
```

4. Abre la URL mostrada en el menú de la bandeja o escanea el QR desde el panel.

## Build de Windows

Usa el script de empaquetado:

```powershell
.\scripts\build_windows.ps1
```

El resultado se guarda en `dist/`.

## Notas

- La app escucha en tu red local, así que el teléfono y el PC deben estar en el mismo Wi-Fi.
- La versión actual es intencionalmente mínima: solo ratón y controles multimedia.
- La interfaz está pensada para verse oscura y premium por defecto.

## Documentación

- [Tutorial (EN)](docs/TUTORIAL.md)
- [Instalación (EN)](docs/INSTALLATION.md)
- [Uso (EN)](docs/USAGE.md)
- [Arquitectura (EN)](docs/ARCHITECTURE.md)
- [Build Windows (EN)](docs/BUILD_WINDOWS.md)
- [Solución de problemas (EN)](docs/TROUBLESHOOTING.md)

## Apoyo al proyecto

- [Apoyar el proyecto](DONATE.es.md)

## Wiki

- [Wiki EN](wiki/README.md)
- [Wiki FR](wiki/README.fr.md)
- [Wiki ES](wiki/README.es.md)

## Tuto

- [Tutorial EN](tuto/README.md)
- [Tutoriel FR](tuto/README.fr.md)
- [Tutorial ES](tuto/README.es.md)

## Selección de idioma

Elige la versión que quieres leer:

| Idioma | Abrir |
| --- | --- |
| English | [Abrir docs EN](docs/README.md) |
| Français | [Ouvrir docs FR](docs/README.fr.md) |
| Español | [Abrir docs ES](docs/README.es.md) |

## Siguientes mejoras

- Añadir control de volumen
- Añadir sincronización del portapapeles
- Añadir atajos de teclado
- Añadir selección de varios PC
- Preparar un instalador firmado para Windows

## Licencia y contribuciones

- Proyecto bajo licencia AGPLv3 o posterior
- Las contribuciones requieren sign-off DCO
- Ver [LICENSE](LICENSE) y [DCO.md](DCO.md)
