const app = require('./server.js');

const PORT = 9090;

app
  .listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  })
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`port ${PORT} already in use`);
    } else {
      throw err;
    }
  });
