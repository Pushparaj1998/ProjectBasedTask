const express = require('express');
const app = express();

const PORT = 3005;

app.use(express.json());
app.use(require('./router/router'));

app.listen(PORT, () => {
    console.log(`Server running on that Port ${PORT}`);
})