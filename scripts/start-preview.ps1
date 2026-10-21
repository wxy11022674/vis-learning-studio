param([switch]$Stop)

$ErrorActionPreference = 'Stop'
$previewRoot = Split-Path -Parent $PSScriptRoot
$previewDist = Join-Path $previewRoot 'dist'
$previewState = Join-Path $previewRoot 'artifacts'
$previewPidFile = Join-Path $previewState 'preview.pid'
$previewUrl = 'http://127.0.0.1:8765/?v=2.2#overview'

function Test-PreviewReady {
    $connection = [System.Net.Sockets.TcpClient]::new()
    try {
        if (-not $connection.ConnectAsync('127.0.0.1', 8765).Wait(800)) { return $false }
        $stream = $connection.GetStream()
        $stream.ReadTimeout = 1500
        # Probe HTTP responsiveness without requesting any website content.
        $request = [Text.Encoding]::ASCII.GetBytes("OPTIONS * HTTP/1.0`r`n`r`n")
        $stream.Write($request, 0, $request.Length)
        $reader = [IO.StreamReader]::new($stream)
        return $reader.ReadLine() -match '^HTTP/1\.[01] 501 '
    } catch { return $false } finally { $connection.Dispose() }
}

$ownedProcess = $null
if (Test-Path -LiteralPath $previewPidFile) {
    $savedPid = (Get-Content -LiteralPath $previewPidFile -Raw).Trim()
    if ($savedPid -match '^\d+$') {
        $candidate = Get-CimInstance Win32_Process -Filter "ProcessId=$savedPid"
        if ($candidate -and $candidate.Name -eq 'python.exe' -and
            $candidate.CommandLine.Contains('-m http.server 8765 --bind 127.0.0.1') -and
            $candidate.CommandLine.Contains('"' + $previewDist + '"')) {
            $ownedProcess = $candidate
        }
    }
}

if ($Stop) {
    if ($ownedProcess) { Stop-Process -Id $ownedProcess.ProcessId }
    if (Test-Path -LiteralPath $previewPidFile) { Remove-Item -LiteralPath $previewPidFile }
    Write-Host 'Preview stopped.'
    exit 0
}

if ($ownedProcess) {
    if (Test-PreviewReady) { Write-Host "Preview already running: $previewUrl"; exit 0 }
    throw 'The existing preview is not responding. Run this script with -Stop, then start again.'
}

if (Get-NetTCPConnection -LocalPort 8765 -State Listen -ErrorAction SilentlyContinue) {
    throw 'Port 8765 is in use by another process. No process was stopped.'
}
if (-not (Test-Path -LiteralPath (Join-Path $previewDist 'index.html'))) {
    throw 'dist/index.html was not found.'
}
$pythonPath = (Get-Command python.exe -ErrorAction Stop).Source
New-Item -ItemType Directory -Path $previewState -Force | Out-Null
$server = Start-Process -FilePath $pythonPath -ArgumentList @(
    '-u', '-m', 'http.server', '8765', '--bind', '127.0.0.1', '--directory', ('"' + $previewDist + '"')
) -WorkingDirectory $previewRoot -WindowStyle Hidden -PassThru `
  -RedirectStandardOutput (Join-Path $previewState 'preview.stdout.log') `
  -RedirectStandardError (Join-Path $previewState 'preview.stderr.log')
$server.Id | Set-Content -LiteralPath $previewPidFile -Encoding ASCII
for ($attempt = 0; $attempt -lt 8; $attempt++) {
    if ((Test-PreviewReady) -and -not $server.HasExited) { Write-Host "Preview ready (PID $($server.Id)): $previewUrl"; exit 0 }
    if ($server.HasExited) { break }
    Start-Sleep -Milliseconds 500
}
throw 'Preview did not become ready. See artifacts/preview.stderr.log.'
