@echo off
echo ================================================
echo   Meeting Minutes Generator - Startup Script
echo ================================================
echo.

REM Check if .env exists
if not exist ".env" (
    echo [ERROR] .env file not found!
    echo Please copy .env.example to .env and add your Groq API key
    echo Get FREE API key: https://console.groq.com/keys
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if LaTeX is installed
where pdflatex >nul 2>nul
if errorlevel 1 (
    echo [WARNING] LaTeX (pdflatex) not found!
    echo.
    echo You need to install LaTeX to generate PDFs:
    echo - Download MiKTeX: https://miktex.org/download
    echo - After installation, RESTART your computer
    echo.
    echo The server will start, but PDF generation will fail without LaTeX.
    echo.
    pause
) else (
    echo [OK] LaTeX is installed
)

echo.
echo ================================================
echo   Starting server...
echo ================================================
echo.
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

npm start
