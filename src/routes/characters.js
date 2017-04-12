import {
    flatten,
    get,
    range,
    map,
    pick,
    isNumber
}  from 'lodash';

import swapi from '../service/swapi';
import {responseWithPagination} from '../utils/helpers';

const responseSize = 50;
const sortByConfig = ['name', 'mass', 'height'];

export default function users(app) {
    app.get('/characters/', (req, res, next) => {
        const query = req.query || {};
        const querySort = query.sort;

        swapi({resource: 'people'})
            .then((data) => {
                getAllData(data)
                    .then((response = []) => {
                        let result = response;

                        if (sortByConfig.indexOf(querySort) !== -1) {
                            result = sortBy(result, querySort);
                        }

                        // Wasn't required, but would make it easier to see the sorting
                        result = map(result, (resultArray) => pick(resultArray, 'name', 'mass', 'height'));

                        res.json(
                            responseWithPagination({
                                url: '/characters',
                                query,
                                count: response.length,
                                responseSize,
                                result
                            })
                        );
                    });
            });
    });
}

function getAllData(data) {
    const sourceCount = get(data, 'result.count');
    const firstPageData = get(data, 'result.results', []);

    const sourceSize = firstPageData.length;
    const sourcePages = sourceSize > 0 ? Math.ceil(sourceCount / sourceSize) : 1;

    const allApiCalls = range(2, sourcePages + 1) // [2, 3, 4, ..., number of pages]
        .map((page) => new Promise((resolve) => {
            swapi(
                {
                    resource: 'people',
                    query: {
                        page
                    }
                }
            )
                .then((data) => {
                    resolve(get(data, 'result.results', []));
                });
        }));

    return Promise.all(allApiCalls)
        .then((response) => {
            return firstPageData.concat(flatten(response));
        });
}

function sortBy(response, sortQuery) {
    if (sortQuery === 'name') {
        return response.sort(({name: nameA}, {name: nameB}) => nameA.localeCompare(nameB));
    } else if (sortQuery === 'mass') {
        return response.sort(({mass: massA}, {mass: massB}) => sortByNumber(massA, massB));
    } else if (sortQuery === 'height') {
        return response.sort(({height: heightA}, {height: heightB}) => sortByNumber(heightA, heightB));
    } else {
        return response;
    }
}

function sortByNumber(valueA, valueB) {
    const result = (parseInt(valueB) || 0) - (parseInt(valueA) || 0);

    if (isNumber(result)) {
        return result;
    } else {
        return 1;
    }
}
