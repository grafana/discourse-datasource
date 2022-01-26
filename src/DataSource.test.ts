import { DiscourseDataSource } from './DataSource';
import { DiscourseQuery, QueryType } from './types';
import { DataQueryRequest, DataSourceInstanceSettings, PluginMeta, toUtc } from '@grafana/data';
// import { DataSourceInstanceSettings, PluginMeta } from '@grafana/data';
import { BackendSrv, BackendSrvRequest, setBackendSrv } from '@grafana/runtime';
import { topicsWithNoResponse } from './testdata/topics_with_no_response';
import { topicsWithNoResponseFromBulkApi } from './testdata/topics_with_no_response_bulk';
import { consolidatedPageViewsFromBulkApi } from './testdata/consolidated_page_views_bulk';
import { topPublicUsers } from './testdata/top_public_users';
import { categories } from './testdata/categories';
import { reports } from './testdata/reports';

describe('DiscourseDatasource', () => {
  const instanceSettings: DataSourceInstanceSettings = {
    id: 1,
    uid: '111',
    type: 'datasource',
    name: 'Discourse data source',
    url: '/api/datasources/proxy/1/discourse',
    meta: {} as PluginMeta,
    jsonData: {},
    access: 'direct'
  };
  let ds: DiscourseDataSource;

  beforeEach(() => {
    ds = new DiscourseDataSource(instanceSettings);
  });

  describe('testDatasource', () => {
    describe('with a successful response', () => {
      beforeEach(() => {
        setupBackendSrv({
          url: '/api/datasources/proxy/1/discourse/search.json?q=find-me-in-the-json',
          response: topicsWithNoResponse,
        });
      });

      it('should return the success message', async () => {
        const result = await ds.testDatasource();
        expect(result.status).toBe('success');
        expect(result.message).toBe('Success');
      });
    });

    describe('with an authentication error', () => {
      beforeEach(() => {
        setupBackendSrv({
          url: '/api/datasources/proxy/1/discourse/admin/reports/topics_with_no_response.json',
          response: {
            errors: ['The requested URL or resource could not be found.'],
            error_type: 'not_found',
          },
        });
      });

      it('should return the error message', async () => {
        const result = await ds.testDatasource();
        expect(result.status).toBe('error');
        expect(result.message).toBe('Invalid credentials. Failed with request to the Discourse API');
      });
    });
  });

  describe('query for metadata', () => {
    describe('for a category list', () => {
      beforeEach(() => {
        setupBackendSrv({
          url: '/api/datasources/proxy/1/discourse/categories.json',
          response: categories,
        });
      });

      it('should return a list of top level categories', async () => {
        const result = await ds.getCategories();
        expect(result.length).toBe(7);
        expect(result[0].label).toBe('All categories');
        expect(result[0].value).toBe('All categories');
        expect(result[1].label).toBe('Grafana');
        expect(result[1].value).toBe('33');
        expect(result[2].label).toBe('Grafana Loki');
        expect(result[2].value).toBe('41');
      });
    });

    describe('for a report list', () => {
      beforeEach(() => {
        setupBackendSrv({
          url: '/api/datasources/proxy/1/discourse/admin/reports.json',
          response: reports,
        });
      });

      it('should return a list of report types', async () => {
        const result = await ds.getReportTypes();
        expect(result.length).toBe(43);
        expect(result[0].label).toBe('Accepted solutions');
        expect(result[0].value).toBe('accepted_solutions.json');
        expect(result[1].label).toBe('Admin Logins');
        expect(result[1].value).toBe('staff_logins.json');
      });
    });
  });

  describe('query', () => {
    describe('for a report', () => {
      describe('with a Discourse API response that returns a single time series', () => {
        beforeEach(() => {
          setupBackendSrv({
            url:
              '/api/datasources/proxy/1/discourse/admin/reports/bulk.json?reports[topics_with_no_response][start_date]=2020-03-15&reports[topics_with_no_response][end_date]=2020-03-22&reports[topics_with_no_response][limit]=1000' +
              '&reports[topics_with_no_response][filters][category]=33&reports[topics_with_no_response][filters][include_subcategories]=true',
            response: topicsWithNoResponseFromBulkApi,
          });
        });

        it('should be parsed into data frames', async () => {
          const options = {
            range: {
              from: toUtc('2020-03-15T20:00:00Z'),
              to: toUtc('2020-03-22T23:59:00Z'),
            },
            rangeRaw: {
              from: 'now-4h',
              to: 'now',
            },
            targets: [{ queryType: QueryType.Report, reportName: 'topics_with_no_response.json', category: '33' }],
          } as DataQueryRequest<DiscourseQuery>;

          const result = await ds.query(options);
          expect(result.data[0].fields[0].name).toBe('time');
          expect(result.data[0].fields[1].name).toBe('value');
          expect(result.data[0].fields[1].config.displayName).toBe('Topics with no response');

          expect(result.data[0].fields[0].values.get(0)).toBe(1622505600000);
          expect(result.data[0].fields[1].values.get(0)).toBe(5);
          expect(result.data[0].fields[0].values.get(1)).toBe(1622592000000);
          expect(result.data[0].fields[1].values.get(1)).toBe(7);
        });
      });

      describe('with a Discourse API response that returns multiple time series', () => {
        beforeEach(() => {
          setupBackendSrv({
            url:
              '/api/datasources/proxy/1/discourse/admin/reports/bulk.json?reports[consolidated_page_views][start_date]=2020-07-01&reports[consolidated_page_views][end_date]=2020-07-31&reports[consolidated_page_views][limit]=1000',
            response: consolidatedPageViewsFromBulkApi,
          });
        });

        it('should be parsed into data frames', async () => {
          const options = {
            range: {
              from: toUtc('2020-07-01T00:00:00Z'),
              to: toUtc('2020-07-31T23:59:00Z'),
            },
            rangeRaw: {
              from: 'now-4h',
              to: 'now',
            },
            targets: [{ queryType: QueryType.Report, reportName: 'consolidated_page_views.json' }],
          } as DataQueryRequest<DiscourseQuery>;

          const result = await ds.query(options);
          expect(result.data[0].fields[0].name).toBe('time');
          expect(result.data[0].fields[1].name).toBe('value');

          expect(result.data[0].fields[1].config.displayName).toBe('Logged in users');
          expect(result.data[0].fields[0].values.get(0)).toBe(1622505600000);
          expect(result.data[0].fields[1].values.get(0)).toBe(2071);
          expect(result.data[0].fields[0].values.get(1)).toBe(1622592000000);
          expect(result.data[0].fields[1].values.get(1)).toBe(2249);

          expect(result.data[1].fields[1].config.displayName).toBe('Anonymous users');
          expect(result.data[1].fields[0].values.get(0)).toBe(1622505600000);
          expect(result.data[1].fields[1].values.get(0)).toBe(25254);
          expect(result.data[1].fields[0].values.get(1)).toBe(1622592000000);
          expect(result.data[1].fields[1].values.get(1)).toBe(27250);

          expect(result.data[2].fields[1].config.displayName).toBe('Crawlers');
          expect(result.data[2].fields[0].values.get(0)).toBe(1622505600000);
          expect(result.data[2].fields[1].values.get(0)).toBe(28954);
          expect(result.data[2].fields[0].values.get(1)).toBe(1622592000000);
          expect(result.data[2].fields[1].values.get(1)).toBe(7989);
        });
      });
    });

    describe('for users', () => {
      describe('with top public users Discourse API response', () => {
        beforeEach(() => {
          setupBackendSrv({
            url: '/api/datasources/proxy/1/discourse/directory_items.json?period=monthly&order=post_count',
            response: topPublicUsers,
          });
        });

        it('should be parsed into data frames with no time column', async () => {
          const options = {
            range: {
              from: toUtc('2020-03-15T20:00:00Z'),
              to: toUtc('2020-03-22T23:59:00Z'),
            },
            rangeRaw: {
              from: 'now-4h',
              to: 'now',
            },
            targets: [{ queryType: QueryType.User }],
          } as DataQueryRequest<DiscourseQuery>;

          const result = await ds.query(options);
          expect(result.data[0].fields[0].name).toBe('id');
          expect(result.data[0].fields[5].name).toBe('post_count');
          expect(result.data[0].fields[9].name).toBe('user.username');

          expect(result.data[0].fields[0].values.get(0)).toBe(14);
          expect(result.data[0].fields[5].values.get(0)).toBe(7);
          expect(result.data[0].fields[9].values.get(0)).toBe('daniellee');
          expect(result.data[0].fields[0].values.get(1)).toBe(11862);
          expect(result.data[0].fields[5].values.get(1)).toBe(17);
          expect(result.data[0].fields[9].values.get(1)).toBe('agnestoulet1');
        });
      });
    });
  });
});

function setupBackendSrv<T>({ url, response }: { url: string; response: T }): void {
  setBackendSrv({
    datasourceRequest(options: BackendSrvRequest): Promise<any> {
      if (options.url === url) {
        return Promise.resolve({ data: response });
      }
      throw new Error(`Unexpected url ${options.url}`);
    },
  } as BackendSrv);
}