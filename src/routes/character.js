import {get, find} from 'lodash';

import swapi from '../service/swapi';

export default function users(app) {
    app.get('/character/:name', (req, res, next) => {
        const characterName = req.params.name;

        // http://swapi.co/api/people?search=han
        swapi({
            resource: 'people',
            query: {search: req.params.name}
        })
            .then((data) => {
                const characters = get(data, 'result.results', []);

                const serchedCharacter = find(
                    characters,
                    ({name}) => name.split(' ')[0].toLowerCase() === characterName.toLowerCase()
                );

                if (serchedCharacter) {
                    res.render('character', serchedCharacter);
                } else {
                    next();
                }
            });
    });
}
