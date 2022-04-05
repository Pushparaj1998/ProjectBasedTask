const express = require('express');
const fileRouter = require('./routers/file');

const app = express();
app.use(express.json());

app.use(fileRouter);

const port = 4000;

app.listen(port, () => {
    console.log(`Server running on that port ${port}`)
})