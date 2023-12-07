const app = require('./server.js');

const PORT = 9090;

app.listen(PORT, (e) => {
  if (e) {
    console.log(e);
  } else {
    console.log(`listening on port ${PORT}`);
  }
});
