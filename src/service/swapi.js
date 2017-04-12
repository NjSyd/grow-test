import request from 'request-promise';

import {SWAPI_URL} from '../utils/constants';

export default function swapi(
    {
        resource,
        query,
        url
    }
) {
    const getUrl = url ? url : `${SWAPI_URL}/${resource}`;

    return new Promise((resolve, reject) => {
        request(
            {
                method: 'GET',
                url: getUrl,
                qs: query
            },
            (error, response, body) => {
                if (error) {
                    reject({
                        error: 'error'
                    });
                }

                let data = {};

                if (error) {
                    data.error = true;
                }

                data.result = JSON.parse(body);

                resolve(data);
            }
        );
    });
}
