const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Database Connection is ready... ');
  })
  .catch((err) => {
    console.log(err);
    console.log('---> Database Connection is not ready <---');
  });
