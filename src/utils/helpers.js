import queryString from 'query-string';
import cloneDeep from 'lodash/cloneDeep';

import {DEFAULT_API_RESPONSE_SIZE, BASE_URL} from '../utils/constants';

/**
 * Format response data with Meta data for information about
 * next, previous, totalPage and count of API response
 *
 * @param  {String} url             routes base url
 * @param  {Object} query           request query for that URL,
 * @param  {Number} count           total number of items for the response
 * @param  {Number} responseSize    the size of response array, defaulted to DEFAULT_API_RESPONSE_SIZE = 10
 * @param  {Array}  result          array of response
 * @return {Object} meta            {next, previous, count, totalPage}
 */

export function responseWithPagination({
    url,
    query = {},
    count = 0,
    responseSize = DEFAULT_API_RESPONSE_SIZE,
    result = []
}) {
    const totalPage = count > 0 ? Math.ceil(count / responseSize) : 0;
    const currentPage = parseInt(query.page || 1);
    const nextPage = totalPage > currentPage ? currentPage + 1 : null;
    const previousPage = currentPage === 1 ? null : currentPage - 1;

    return {
        next: getLinkingUrl({url, query, page: nextPage}),
        previous: getLinkingUrl({url, query, page: previousPage}),
        count,
        totalPage: count > 0 ? Math.ceil(count / responseSize) : 0,
        result: result.slice((currentPage - 1) * responseSize, (currentPage) * responseSize)
    };
}

/**
 * Create next and previous url for response meta data
 *
 * @param  {String} url             routes base url
 * @param  {Object} query           request query for that URL,
 * @param  {Number} page            total number of items for the response
 * @return {String} url             next/previous url
 */
export function getLinkingUrl({url, query = {}, page}) {
    let initialQuery = cloneDeep(query);

    initialQuery.page = page;

    return page ? `${BASE_URL}${url}?${queryString.stringify(initialQuery)}` : null;
}
