param(
    [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
    [string]$OutputDir = (Join-Path (Resolve-Path (Join-Path $PSScriptRoot "..")).Path "dist")
)

$ErrorActionPreference = "Stop"

$python = "C:\Users\defar\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
$venvDir = Join-Path $OutputDir ".build-venv"
$buildDir = Join-Path $OutputDir "BouRemoteServ"
$archivePath = Join-Path $OutputDir "BouRemoteServ-windows.zip"

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
if (Test-Path $buildDir) {
    Remove-Item -Recurse -Force $buildDir
}
if (Test-Path $archivePath) {
    Remove-Item -Force $archivePath
}

& $python -m venv $venvDir
$venvPython = Join-Path $venvDir "Scripts\python.exe"
& $venvPython -m pip install --upgrade pip
& $venvPython -m pip install -r (Join-Path $ProjectRoot "requirements.txt") pyinstaller

$specPath = Join-Path $ProjectRoot "remote_dock.spec"
$pyinstallerArgs = @(
    "--noconfirm",
    "--clean",
    "--onefile",
    "--name", "BouRemoteServ",
    "--add-data", "$ProjectRoot\web;web",
    "--distpath", $buildDir,
    "--workpath", (Join-Path $OutputDir "build"),
    "--specpath", $OutputDir,
    (Join-Path $ProjectRoot "main.py")
)

& $venvPython -m PyInstaller @pyinstallerArgs

if (Test-Path $archivePath) {
    Remove-Item -Force $archivePath
}
Compress-Archive -Path (Join-Path $buildDir "*") -DestinationPath $archivePath

Write-Host "Build complete:"
Write-Host $buildDir
Write-Host $archivePath
