@echo off
set "p1=C:\Users\%USERNAME%\AppData\Local\Temp\electron-packager\win32-x64"
set "p2=D:\Library\dev\node\task-completion\Task Completion-win32-x64"

rem start explorer "%p1%"

if exist "%p1%" (
    rmdir /s /q "%p1%"
    echo Directory removed successfully.
) else (
    echo Directory not found.
)

if exist "%p2%" (
    rd /s /q "%p2%"
    echo Directory removed successfully.
) else (
    echo Directory not found.
)

npm run build