<#
.SYNOPSIS
  Compress MOI video files using FFmpeg for web delivery.
.DESCRIPTION
  Scans public/videos/ and src/assets/ for .mp4 files and re-encodes them
  with H.265 (hevc) at a lower bitrate suitable for web. Originals are
  backed up to a _original/ folder next to each file.
.NOTES
  Requires FFmpeg: https://ffmpeg.org/download.html
  Run: winget install "FFmpeg (x64)"   (Windows)
  Or:  brew install ffmpeg             (macOS)
#>

$directories = @(
  ".\artifacts\moi-website\public\videos",
  ".\artifacts\moi-website\src\assets"
)

$extensions = @("*.mp4", "*.mov", "*.avi", "*.mkv")

# Quality preset: lower CRF = higher quality, larger file
# 28 is a good balance for web video
$crf = 28

# Target max width (maintains aspect ratio)
$maxWidth = 720

foreach ($dir in $directories) {
  if (-not (Test-Path $dir)) {
    Write-Host "Skipping $dir — not found" -ForegroundColor Yellow
    continue
  }

  $files = Get-ChildItem -Path $dir -Include $extensions -Recurse

  foreach ($file in $files) {
    $backupDir = Join-Path $file.DirectoryName "_original"
    $backupPath = Join-Path $backupDir $file.Name

    # Skip if already compressed (output file exists)
    $outputName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name) + ".hevc.mp4"
    $outputPath = Join-Path $file.DirectoryName $outputName
    if (Test-Path $outputPath) {
      Write-Host "Skipping $($file.Name) — already compressed" -ForegroundColor Gray
      continue
    }

    Write-Host "Compressing $($file.Name)..." -ForegroundColor Cyan

    # Backup original
    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
    Copy-Item -Path $file.FullName -Destination $backupPath -Force

    # Compress with H.265
    & ffmpeg -i $file.FullName `
      -c:v libx265 `
      -crf $crf `
      -vf "scale='min($maxWidth,iw)':min'(trunc(oh*a/2)*2)':force_original_aspect_ratio=decrease" `
      -c:a aac -b:a 64k `
      -movflags +faststart `
      -y `
      $outputPath 2>&1

    if ($LASTEXITCODE -eq 0) {
      $originalSize = [math]::Round($file.Length / 1MB, 2)
      $newSize = [math]::Round((Get-Item $outputPath).Length / 1MB, 2)
      $saved = [math]::Round(($originalSize - $newSize) / $originalSize * 100, 0)
      Write-Host "  Done: ${originalSize}MB → ${newSize}MB (${saved}% saved)" -ForegroundColor Green
    } else {
      Write-Host "  Failed: $($file.Name)" -ForegroundColor Red
    }
  }
}

Write-Host "`nAll done! Compressed videos are named *.hevc.mp4." -ForegroundColor Green
Write-Host "Update videoSrc paths in your code to point to the .hevc.mp4 files." -ForegroundColor Yellow
