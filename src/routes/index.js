import express from 'express';

import routesCharacter from './character';
import routesCharacters from './characters';
import routesPlanetresidents from './planetresidents';
import routes404  from './404';

export default function routes(app) {
    app.use('/public', express.static(`${__dirname}/../../public`));

    app.get('/', (req, res) => {
        res.render('home', {title: 'Index'});
    });

    routesCharacter(app);
    routesCharacters(app);
    routesPlanetresidents(app);

    routes404(app);
}
