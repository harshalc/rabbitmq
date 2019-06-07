import express = require('express');
import bodyParser from 'body-parser';
 import router from './routes';
// Create a new express application instance
const app: express.Application = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});