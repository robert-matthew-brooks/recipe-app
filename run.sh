#!/bin/bash

gnome-terminal --tab -- bash -c "cd server; npx kill-port 9090; npm run listen"
gnome-terminal --tab -- bash -c "cd client; npx kill-port 5173; npm run dev"
