Add-Type -AssemblyName System.Drawing
$imgPath = 'C:\Users\basur\.gemini\antigravity\brain\d1a595ae-6bd7-4355-b409-ecff5b6ea091\media__1788030190200.png'
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)
$cropW = [int]($bmp.Width * 0.52)
$rect = New-Object System.Drawing.Rectangle(0, 0, $cropW, $bmp.Height)
$cropped = $bmp.Clone($rect, $bmp.PixelFormat)
$bmp.Dispose()

$ms = New-Object System.IO.MemoryStream
$cropped.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()

$b64 = [Convert]::ToBase64String($ms.ToArray())
$ms.Dispose()

$jsContent = "export const EXACT_LEFT_BG = 'data:image/png;base64,$b64';"
[System.IO.File]::WriteAllText('C:\Users\basur\OneDrive\Desktop\nestaway_homes\src\components\auth\leftBgData.js', $jsContent)
Write-Host "Successfully exported EXACT_LEFT_BG Base64!"
