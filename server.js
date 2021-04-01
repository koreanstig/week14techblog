const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sess));

sequelize.sync({force: false}).then(()=> {
    app.listen(PORT, ()=> {
        console.log(`Now listening on PORT: ${PORT}`);
    })
})

