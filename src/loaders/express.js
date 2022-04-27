import express, { json, urlencoded } from 'express';
import favicon from 'serve-favicon';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import expressLayouts from 'express-ejs-layouts';
import morgan from 'morgan';
import cors from 'cors';
import { join, resolve } from 'path';

import indexRouter from '../routes/indexRouter.js';
import flayViewRouter from '../routes/flayViewRouter.js';
import flayApiRouter from '../routes/flayApiRouter.js';

export default ({ app }) => {

    const __dirname = resolve();

    // view engine setup
    // ### ejs & layouts
    app.set('views', join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.set('layout', 'layout');
    app.set('layout extractScripts', true);
    app.use(expressLayouts);

    app.use(
        morgan('dev', {
            skip: (req, res) => res.statusCode < 400,
        }),
    );
    app.use(json());
    app.use(cors());
    app.use(urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(express.static(join(__dirname, 'public')));
    app.use(favicon(join(__dirname, 'public', 'favicon.ico')));

    app.use('/', indexRouter);
    app.use('/flay', flayViewRouter);
    app.use('/api', flayApiRouter);

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        next(createError(404));
    });
    // error handler
    app.use((err, req, res, next) => {
        // console.log(req.headers);
        const resErr = {
            isXhr: req.headers['x-requested-with'] === 'XMLHttpRequest' || req.headers.accept.indexOf('json') > -1,
            status: err.status || 500,
            message: err.message || 'unknown error',
            stack: err.stack,
        };

        if (req.app.get('env') !== 'development') {
            resErr.stack = null;
        }

        if (resErr.status !== 404) {
            console.log('error', resErr);
        }

        if (resErr.isXhr) {
            res.status(resErr.status).json(resErr);
        } else {
            // set locals, only providing error in development
            res.locals.message = resErr.message;
            res.locals.error = resErr;
            res.status(resErr.status).render('error');
        }
    });

    return app;
};

