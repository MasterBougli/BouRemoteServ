param(
    [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

$ErrorActionPreference = "Stop"

$python = "C:\Users\defar\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
& $python (Join-Path $ProjectRoot "main.py")

