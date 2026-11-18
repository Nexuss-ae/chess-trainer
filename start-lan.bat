@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required to host an offline LAN lobby.
  echo Install the current Node.js LTS version, then run this file again.
  pause
  exit /b 1
)
echo Starting Chess Trainer for local network play...
echo Keep this window open while your game is running.
echo If Windows Firewall asks, allow Node.js on private networks.
node server.js
echo The local game server has stopped.
pause
