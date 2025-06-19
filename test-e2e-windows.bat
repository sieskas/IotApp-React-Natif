@echo off
echo === [Detox] Configuration de l'environnement ===
set "JAVA_HOME=C:\java\JDK17"
set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
set "ANDROID_SDK_ROOT=%ANDROID_HOME%"
set "PATH=%ANDROID_HOME%\emulator;%ANDROID_HOME%\platform-tools;%PATH%"

echo === [Detox] Démarrage de l'émulateur ===
start "" /B emulator -avd Pixel_9_Pro_XL_API_35

echo === [Detox] Attente du démarrage de l'émulateur ===
timeout /t 25

echo === [Detox] Build + Test ===
npx detox build -c android.emu.release.windows && npx detox test -c android.emu.release.windows
