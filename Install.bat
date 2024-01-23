@echo off
git pull
pushd "%~dp0"
npm i
popd
call "Run.bat"