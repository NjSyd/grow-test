import express from 'express';
import path    from 'path';

import routes  from './routes/index';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

routes(app);

module.exports = app;
