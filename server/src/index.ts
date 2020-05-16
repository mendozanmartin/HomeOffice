import * as express from "express";
const app = express;

app.use(express.static('assets'));

app.listen(3000, () => console.log('Gator app listening on port 3000!'));