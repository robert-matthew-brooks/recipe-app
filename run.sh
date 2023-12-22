gnome-terminal --tab --title server -- bash -c "cd server; npx kill-port 9090; npx nodemon listen"
gnome-terminal --tab --title client -- bash -c "cd client; npx kill-port 5173; npx vite --open"
