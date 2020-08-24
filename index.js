let express = require('express');//to create web apps
var exphbs = require('express-handlebars');//to render templates
const bodyParser = require('body-parser');//require body parser for htm functionality
const SettingsBill = require('./settings-bill')//require factory function

var moment = require('moment'); // require
moment().format();

let app = express();
let settingsBill = SettingsBill();
const time = settingsBill.actions()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({ layoutsDir: './views/layouts' }));

app.use(express.static('public'));//to use css


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())



//default get root that renders home template
app.get('/', function (req, res) {
    res.render('home', {
        settings: settingsBill.getSettings(),
        totals: settingsBill.totals(),
        color: settingsBill.color()
    });
});

app.post('/settings', function (req, res) {

    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel,
    })
    res.redirect('/')
    console.log(settingsBill.getSettings())
})


app.post('/action', function (req, res) {
    res.redirect("/")
    settingsBill.recordAction(req.body.actionType)
});

app.get('/actions', function (req, res) {
    for (const key of time) {
        key.ago = moment(key.timestamp).fromNow()
    }
    res.render("actions", { actions: time })
});

app.get('/actions/:actionType', function (req, res) {

    const actionType = req.params.actionType
    const actionForTime = settingsBill.actionsFor(actionType)
    for (const key of actionForTime) {
        key.ago = moment(key.timestamp).fromNow()
    }
    res.render("actions", { actions: actionForTime })

});

const PORT = process.env.PORT || 3009;

app.listen(PORT, function () {
    console.log('App starting on port' + PORT);
});