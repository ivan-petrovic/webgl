const express = require('express');
const path = require("path");

const app = express();

if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'shaders')));

app.get('/', function (req, res) {
    res.render('index');
    // res.render('index', { title: 'Hey', message: 'Hello there!' });
});

app.get('/something', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
