$ErrorActionPreference = 'SilentlyContinue'
Set-Location $PSScriptRoot

# --- Eski nusxalarni to'xtatamiz (bir vaqtda faqat bitta tunnel ishlasin) ---
$me = $PID
Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" |
  Where-Object {
    $_.ProcessId -ne $me -and
    ($_.CommandLine -like '*_tunnel.ps1*' -or $_.CommandLine -like '*_watch.ps1*')
  } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }

Get-Process cloudflared | Stop-Process -Force
Start-Sleep -Seconds 1

$exe = Join-Path $PSScriptRoot 'cloudflared.exe'

while ($true) {
  Remove-Item 'cf.log' -Force -ErrorAction SilentlyContinue

  $p = Start-Process -FilePath $exe `
       -ArgumentList 'tunnel', '--url', 'http://127.0.0.1:5173', '--no-autoupdate', '--logfile', 'cf.log' `
       -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -PassThru

  # --- Yangi manzilni kutamiz ---
  $url = $null
  for ($i = 0; $i -lt 60; $i++) {
    Start-Sleep -Seconds 1
    if ($p.HasExited) { break }
    $m = Select-String -Path 'cf.log' -Pattern 'https://[-a-z0-9]+\.trycloudflare\.com' -AllMatches |
         Select-Object -First 1
    if ($m) { $url = $m.Matches[0].Value; break }
  }

  if ($url) {
    [IO.File]::WriteAllText((Join-Path $PSScriptRoot 'tunnel-url.txt'), $url)
    Write-Host ''
    Write-Host "  Internet manzili: $url"
    Write-Host '  Bu oyna ochiq tursin.'
    Write-Host ''
  }

  # --- Sog'ligini kuzatamiz ---
  while (-not $p.HasExited) {
    Start-Sleep -Seconds 8
    $bad = Select-String -Path 'cf.log' -Pattern 'Tunnel not found|Unauthorized' | Select-Object -First 1
    if ($bad) { Stop-Process -Id $p.Id -Force; break }
  }

  Write-Host '  Tunnel uzildi. Yangi manzil olinmoqda...'
  Start-Sleep -Seconds 3
}
