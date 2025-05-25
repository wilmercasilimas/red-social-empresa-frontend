@echo off
title Iniciando Red-Social-Empresa...

:: Iniciar MongoDB
start cmd.exe /k "cd /d C:\Program Files\MongoDB\Server\8.0\bin && mongod.exe"

:: Esperar unos segundos para que MongoDB arranque
timeout /t 5 > nul

:: Iniciar backend
start cmd.exe /k "cd /d C:\proyectos\www\Red-Social-Empresa\backend && npm run dev"


timeout /t 2

echo Iniciando el frontend...
start cmd /k "cd C:\proyectos\www\red-social-empresa-frontend && npm run dev"

echo Proyecto Red Social Empresa en ejecución.
exit