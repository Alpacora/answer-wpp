#!/bin/sh

# Inicia o app em background
node dist/app.js &

# Inicia o filebrowser em foreground
filebrowser -r /usr/src/app -p 8080
