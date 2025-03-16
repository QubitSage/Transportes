$nextBinPath = Join-Path -Path (Get-Location) -ChildPath "node_modules\.bin\next.cmd"
Write-Host "Running Next.js from: $nextBinPath"
& $nextBinPath dev 