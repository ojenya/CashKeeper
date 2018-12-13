var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var mysql = require('mysql');
var json = require('json');
var app = express();
function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib());
}
var moment = require('moment');
moment().format();
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'expense'
});
connection.connect();
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
    {
        src: __dirname + '/public'
        , compile: compile
    }
))
app.use(express.static(__dirname + '/public'))

// app.get('/', function (req, res) {
//   res.render('index',
//   { title : 'Home' }
//   )
// })

var path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var session = require("express-session"),
    bodyParser = require("body-parser");
// app.set('view engine', 'jade')
// app.set('views', path.join(__dirname, process.argv[3]))
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

log = [{ user: 'user1', pas: 1, role: 'user' }, { user: 'admin', pas: 4, role: 'admin' },
{ user: 'user2', pas: 4, role: 'user' }, { user: 'Sonya', pas: 1, role: 'admin' }, { user: 'Jenya', pas: 1, role: 'admin' }];

app.use(express.static("public"));//kl
app.use(session({ secret: "cats" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/index', (req, res) => {
    if (req.query.e == "1") {
        console.log("BAD NAME / PASSWORD");
        res.render('index', { err: '1' });
    }
    else res.render('index');
});

app.get('/', (req, res) => {
    if (log[req.user.id].role == 'admin') {
        res.render('text', { name: 'admin', username: log[req.user.id].user });     //фыафыафыа     
    }
    else res.render('text', { username: log[req.user.id].user });
});
// app.get('/falelog', (req, res) => {
//     res.render('fale');
//     });
// app.get('/admin1', (req, res) => {
//     res.render('admin1');
//     });

app.get('/reg', (req, res) => {
    res.render('reg');
});
app.post('/reg', (req, res) => {
    res.redirect('/index');
});

app.post('/index',
    passport.authenticate('local', {
        successRedirect: '/check',
        failureRedirect: '/index?e=1'
    }));

app.get('/check', authentication(), (req, res) => {
    if (log[req.user.id].role == 'admin') {
        res.redirect('/home1');
    }
    else res.redirect('/home1');
});
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'passwd'
},
    function (username, password, done) {
        var i;
        var user = {};
        //  console.log(username, password);
        for (i = 0; i < log.length; i++) {
            if ((username == log[i].user)) {
                if (password == log[i].pas) {
                    user.username = log[i].user;
                    user.id = i;
                    return done(null, user);
                }
            }

        }
        return done(null, false);

    }))

function authentication() {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/index');
    }
}
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    var user = {};
    user.username = log[id].user;
    user.id = id;
    done(null, user);
});

app.get('/home1', (req, res) => {
    user = req.user.username;
    // console.log(req.user.username);
    //console.log(req.body.r0);
    connection.query(`SELECT category, sum, text, date FROM costs WHERE user_name = "${user}"`, function (err, rows, fields) { //(${username})

        connection.query('SELECT name FROM `category`', function (err, rowsc, fields) {
            for (k = 0; k < rows.length; k++) {
                rows[k].date = moment.unix(rows[k].date).format("DD/MM/YYYY");

            }

            //console.log(moment.unix(rows[3].date).format("MM/DD/YYYY"));

            if (err) throw err;
            catFod = 0;
            catTr = 0;
            catBuy = 0;
            catEnt = 0;
            for (i = 0; i < rows.length; i++) {
                if ((rows[i].category == 'food')) {
                    catFod = catFod + rows[i].sum;
                }
                if ((rows[i].category == 'transport')) {
                    catTr = catTr + rows[i].sum;
                }
                if ((rows[i].category == 'buy')) {
                    catBuy = catBuy + rows[i].sum;
                }
                if ((rows[i].category == 'entertainment')) {
                    catEnt = catEnt + rows[i].sum;
                }
            }
            m = 'Декабрь';
            res.render('form', { pages: rows, f: catFod, t: catTr, b: catBuy, e: catEnt, month: m, categories: rowsc, keks: user });




        });

    });

});

app.post('/form', (req, res) => {
    // if(req.body.category == "r0"){
    //     cat = "food"
    // }
    // else if(req.body.category == "r1"){
    //     cat ="transport";
    // }
    // else if(req.body.category == "r2"){
    //     cat ="buy";
    // }
    // else if(req.body.category == "r3"){
    //     cat ="entertainment";
    // }
    // else if(req.body.category == "r4"){
    //     cat ="KEKS";
    // }
    // comment = req.body.comment;
    // sum = req.body.howmuch;
    // //category = req.body.categories
    // let date = new Date(req.body.calendar).getTime()/1000; // varchar -> date 12-12-2018 021524785
    // //console.log(date);
    // // connection.query(`INSERT INTO costs (date) VALUES (${date})`, function (err, rows, fields) {category,sum,
    // connection.query(`INSERT INTO costs (user_name,category,sum,date,text) VALUES ("${user}","${cat}",${sum},${date},"${comment}")`, function (err, rows, fields) {
    // });
    res.redirect('/mimo');
    // res.redirect('/home1');
});

app.post('/add', (req, res) => {
    date = new Date(req.body.date).getTime() / 1000;
    cat = req.body.cat;
    sum = req.body.sum;
    comment = req.body.comment;

    if (req.body.cat == "r0") {
        cat = "food"
    }
    else if (req.body.cat == "r1") {
        cat = "transport";
    }
    else if (req.body.cat == "r2") {
        cat = "buy";
    }
    else if (req.body.cat == "r3") {
        cat = "entertainment";
    }
    else if (req.body.cat == "r4") {
        cat = "KEKS";
    }


    console.log(cat);
    console.log(req.body.sum);
    console.log(req.body.date);
    console.log(req.body.comment);

   

    //category = req.body.categories
    // let date = new Date(req.body.date).getTime()/1000; // varchar -> date 12-12-2018 021524785
    // console.log(date);
    // connection.query(`INSERT INTO costs (date) VALUES (${date})`, function (err, rows, fields) {category,sum,
    connection.query(`INSERT INTO costs (user_name,category,sum,date,text) VALUES ("${user}","${cat}",${sum},${date},"${comment}")`, function (err, rows, fields) {
        connection.query(`SELECT category, sum, text, date FROM costs WHERE user_name = "${user}"`, function (err, rows, fields) {
            // connection.query('SELECT name FROM `category`', function (err, rowsc, fields) {
            //     for(k=0; k<rows.length; k++){
            //       rows[k].date=moment.unix(rows[k].date).format("DD/MM/YYYY");  

            //     }
            // res.render('form', { pages: rows, f: catFod, t: catTr, b: catBuy, e: catEnt, month: m, categories: rowsc, keks: user});});
            // // res.send (JSON.stringify({a:1, toJSON: function(){ return "a"; }}));
            res.send(JSON.stringify({ cat:cat, sum:sum, date:date, comment:comment}));  
        });});


    // отправить на сервер req body proverka            ++++
    // perenosim kod, posle insert new select =>        ++++
    // res send json
    // console browser  undifined = {14124:14124}
    // draw
});


app.listen(8000);