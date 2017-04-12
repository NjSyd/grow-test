import {get, extend} from 'lodash';
import request from 'request-promise';

import swapi from '../service/swapi';

export default function users(app) {
    app.get('/planetresidents', (req, res) => {
        getAllData()
            .then((response) => {
                res.send(response);
            })
            .catch((err) => {
                res.send(err);
            });
    });
}

function getAllData() {
    return new Promise((resolve) => {
        swapi({
            resource: 'planets'
        }).then((data) => {
            const result = get(data, 'result', {});
            const planets = get(result, 'results', []);
            let responseResults = {};
            let responseData = {
                count: get(result, 'count'),
                next: get(result, 'next'),
                previous: get(result, 'previous')
            };

            planets.map((planet) => {
                const residents = get(planet, 'residents', []);
                const allAPICalls = residents.map((residents) => {
                    return new Promise((resolve) => {
                        request(residents).then((body) => {
                            resolve(JSON.parse(body).name);
                        });
                    });
                });

                Promise.all(allAPICalls).then((residents) => {
                    extend(responseResults, {[planet.name]: residents});

                    if (Object.keys(responseResults).length === planets.length) {
                        responseData.results = responseResults;
                        resolve(responseData);
                    }
                });
            });
        });
    });
}
