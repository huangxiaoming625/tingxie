@echo off
echo ========================================
echo   小学语文听写助手 - 服务器启动
echo ========================================
echo.
echo [1] 启动开发服务器 (推荐)
echo [2] 预览构建版本
echo.
set /p choice=请选择 (1/2):

if "%choice%"=="1" (
    echo.
    echo 正在启动开发服务器...
    echo 请在浏览器中打开: http://localhost:3000
    npm run dev
) else if "%choice%"=="2" (
    echo.
    echo 正在启动预览服务器...
    echo 请在浏览器中打开: http://localhost:8080
    cd dist
    python -m http.server 8080
) else (
    echo 无效选择！
    pause
)
