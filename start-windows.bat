@echo off
setlocal

REM === CONFIGURATION MANUELLE DES VARIABLES ===
set "JAVA_HOME=C:\java\JDK17"
set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
set "ANDROID_SDK_ROOT=%ANDROID_HOME%"
set "PATH=%ANDROID_HOME%\emulator;%ANDROID_HOME%\platform-tools;%PATH%"

REM === AFFICHAGE DE L'ENVIRONNEMENT ===
echo.
echo ✅ Environnement Android configuré pour cette session :
echo ---------------------------------------------
echo JAVA_HOME       = %JAVA_HOME%
echo ANDROID_HOME    = %ANDROID_HOME%
echo ANDROID_SDK_ROOT= %ANDROID_SDK_ROOT%
echo.

REM === AFFICHAGE DE LA VERSION D'ADB ===
echo 📦 Version ADB :
adb --version
if errorlevel 1 (
  echo ❌ Erreur : ADB non détecté dans %ANDROID_HOME%\platform-tools
  pause
  exit /b 1
)

REM === LANCEMENT DE METRO ===
echo.
echo 🚀 Lancement de React Native avec npm...
npm run start

endlocal
