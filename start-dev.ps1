# ============================
# START DEV ENVIRONMENT
# OCR + Next.js
# ============================

Write-Host "Stopping old OCR containers..."
docker stop algerian-id-ocr 2>$null
docker rm algerian-id-ocr 2>$null

# Path to your OCR folder
$OCR_PATH = "D:\dznotaire\dznotaire-app\ocr"

Write-Host "Starting OCR Docker server..."

Start-Process powershell -ArgumentList "
    docker run --name algerian-id-ocr --rm -p 5005:5005 -v `"${OCR_PATH}:/app`" algerian-id-ocr
" -WindowStyle Minimized

Start-Sleep -Seconds 2
Write-Host "OCR Server running at http://localhost:5005/ocr"


Write-Host "Starting Next.js Dev Server..."

Start-Process powershell -ArgumentList "
    cd `"$PSScriptRoot`";
    npm run dev
"

Write-Host "Both servers started"
Write-Host "Next.js → http://localhost:3000"
Write-Host "OCR API → http://localhost:5005/ocr"
