import * as http from 'http';
import * as url from 'url';
import { isUndefined, filter, get, orderBy } from 'lodash';

import DEMO_DATA from './data';

/**
 * Node.js server file.
 *
 * Handles remote requests from Demo component.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-beta.2
 */
const HttpDispatcher = require('httpdispatcher');

const hostname = '127.0.0.1';
const port = 3030;
const dispatcher = new HttpDispatcher();

dispatcher.onGet('/', function(request: any, result: any) {
  const query: any = url.parse(request.url, true).query;

  const page: number = isUndefined(query.page) ? 1 : query.page;
  const pageSize: number = query.pageSize;

  const start: number = (page - 1) * pageSize;
  const end: number = start + pageSize;

  let sortType: string;
  let sortBy: string;

  if (!isUndefined(query.orderBy)) {
    sortType = query.orderBy.indexOf('-') === 0 ? 'desc' : 'asc';
    sortBy = query.orderBy.replace('-', '');
  }

  let filters: string[] = [];
  for (let filterName in query) {
    if (filterName !== 'page' && filterName !== 'pageSize' && filterName !== 'orderBy'
        && filterName !== 'expand') {
      filters[filterName] = query[filterName];
    }
  }

  let data: any[] = DEMO_DATA;

  // apply filters
  data = filter(data, function(item: any) {
    let match = true;
    for (let filterName in filters) {
      if (filters.hasOwnProperty(filterName)) {
        let value = get(item, filterName).toString();

        match = match &&
          (value.match(new RegExp(filters[filterName], 'i')) !== null);
      }
    }

    return match;
  });

  result.writeHead(200, {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers': 'X-Pagination-Total-Count, X-Pagination-Page-Count, X-Pagination-Current-Page, X-Pagination-Per-Page',
    'X-Pagination-Total-Count': data.length,
    'X-Pagination-Page-Count': Math.ceil(data.length / pageSize),
    'X-Pagination-Current-Page': page,
    'X-Pagination-Per-Page': !isUndefined(pageSize) ? pageSize : ''
  });

  // sort data
  if (!isUndefined(sortBy)) {
    data = orderBy(data, [sortBy], [sortType]);
  }

  // slice page
  if (!isUndefined(pageSize)) {
    data = data.slice(start, end);
  }

  result.end(JSON.stringify(data));
});

const server = http.createServer((request: any, result: any) => {
 dispatcher.dispatch(request, result);
});

server.listen(port, hostname, () => {
  console.log('Server running at http://%s:%d', hostname, port);
});
