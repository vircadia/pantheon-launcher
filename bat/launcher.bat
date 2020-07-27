@echo off
SETLOCAL ENABLEDELAYEDEXPANSION
TITLE Vircadia Launcher - Detached Launching Utility
set execPath="%~1"
echo %execPath%
set parameters=%~2
set parameters=!parameters:#20= !
set parameters=!parameters:#40="!
set parameters=!parameters:#60=^=!
echo %execPath%
echo %parameters%
%execPath% %parameters%