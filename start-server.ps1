# 启动服务器的 PowerShell 脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    小学语文听写助手 - 服务器启动" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[1] 启动开发服务器 (推荐)"
Write-Host "[2] 预览构建版本"
Write-Host ""

$choice = Read-Host "请选择 (1/2)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "正在启动开发服务器..." -ForegroundColor Yellow
    Write-Host "请在浏览器中打开: http://localhost:3000" -ForegroundColor Green
    npm run dev
} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "正在启动预览服务器..." -ForegroundColor Yellow
    Write-Host "请在浏览器中打开: http://localhost:8080" -ForegroundColor Green
    Set-Location dist
    python -m http.server 8080
} else {
    Write-Host "无效选择！" -ForegroundColor Red
    Read-Host "按回车键退出"
}
