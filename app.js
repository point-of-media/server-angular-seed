// get config
var config = require('./config').Config;
var pkgJson = require('./package.json');

// set up third-party modules
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

var app = express();

var index = require('./routes/index');

// disable ugly header-setting
app.disable('x-powered-by');

// enable proxy
app.enable('trust-proxy');

// allow headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', config.headersettings.alloworigin);
    res.header('Access-Control-Allow-Methods', config.headersettings.allowmethods);
    res.setHeader('Access-Control-Allow-Headers', config.headersettings.allowheaders);

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
});


// dir setup - static dirs

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// routes
app.use('/', index);

// protected
app.use('*/p/*', function (req, res, next) {
    authentication.validateService(req, res, next);
});


app.use('/v1', v1Routes);


// catch 404 and forward to error handler - has to be last middleware
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    logger.info({ 'type': '404', 'url': req.url }, '404 not found: ' + req.url);
    err.status = 404;
    err.url = req.url;
    next(err, req, res);
});

// error handler
// will print stacktrace


// error handler
// will print stacktrace
app.use(function (err, req, res, next) {

    if (err.status !== 404 && err.status !== 401 && err.status !== 400 && err.status !== 403) {
        logger.error(err);
    }
    if (global.process.env.NODE_ENV === 'production') {
        return res.status(err.status || 500).json({});
    }
    if (!config.switches.printGlobalErrorMessages) {
        return res.status(err.status || 500).json({
            error: err,
            message: err.message
        });
    }
    res.status(err.status || 500).json({
        error: err,
        message: err.message
    });
    next();
});






module.exports = app;
//export logger for testing
module.exports.logger = logger;
