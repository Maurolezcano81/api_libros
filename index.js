const express = require('express');
const app = express();
app.use(express.json());

const libRout = require('./routes/libros');
const errorHandler = require('./middlewares/errorHandler');

app.use('/libros', libRout);
app.use(errorHandler)



app.listen(3000, () => {
    console.log('listening on port 3000')
});