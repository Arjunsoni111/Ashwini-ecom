var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    lusca = require('lusca'),
    Gen = require('../app/modules/module.generic'),
    constant = require('../config/constants'),
    helmet = require('helmet'),
    Dev = require('./env/' + process.env.NODE_ENV),
    compression = require('compression'),
    jwt = require('jsonwebtoken');

module.exports = function (db) {
    var app = express();
    app.use(compression());
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: Dev.SESSION_SECRET,
        store: new MongoStore({
            mongooseConnection: db.connection,
            ttl: 86400,
            collection: Dev.SESSION_COLLECTION
        })
    }));
    app.use(helmet());
    app.use(lusca({
        xframe: 'SAMEORIGIN',
        p3p: 'ABCDEF',
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        },
        xssProtection: true,
        nosniff: true
    }));
    app.use(function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", Dev.SITE_PATH);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-forwarded-for");
        next();
    });
    app.use(function (req, res, next) {
        if (req.body) {
            Object.keys(req.body).forEach(function (key) {
                if (typeof req.body[key] == "string") {
                    req.body[key] = req.body[key].trim();
                }
            });
        }

        if (constant.NOAUTH.includes(req.originalUrl.split('/')[1]) || constant.NOAUTH.includes((req.originalUrl.split('/')[1]).split('?')[0])) {
            require('../app/routes/route.noAuth')(app);
            next();
        } else {
            if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
                jwt.verify(req.headers.authorization.split(' ')[1], Dev.JWT_CONSTANT, function (err, decode) {
                    if (err) {
                        return res.json(Gen.responseReturn(constant.TOKEN_EXPIRED));
                    } else {
                        req.body.decode = decode;
                        require('../app/routes/route.withAuth')(app);
                        next();
                    }
                });
            } else {
                return res.json(Gen.responseReturn(constant.AUTH_ERROR));
            }
        }
    })
    return app;
}
