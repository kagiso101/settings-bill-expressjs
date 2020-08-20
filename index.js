let express = require('express');//to create web apps
var exphbs = require('express-handlebars');//to render templates
const bodyParser = require('body-parser');//require body parser for htm functionality
const SettingsBill = require('./settings-bill')//require factory function

let app = express();
let settingsBill = SettingsBill();


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
        color : settingsBill.color()
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
    res.render("actions", { actions: settingsBill.actions() })
});

app.get('/actions/:actionType', function (req, res) {
    const actionType = req.params.actionType
    res.render("actions", { actions: settingsBill.actionsFor(actionType) })

});

const PORT = process.env.PORT || 3009;

app.listen(PORT, function () {
    console.log('App starting on port'+  PORT);
});