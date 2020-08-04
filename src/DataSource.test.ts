import { DiscourseDataSource } from './DataSource';
import { DiscourseDataSourceOptions, DiscourseQuery, QueryType } from './types';
import { DataQueryRequest, DataSourceInstanceSettings, PluginMeta, toUtc } from '@grafana/data';
import { BackendSrv, BackendSrvRequest, setBackendSrv } from '@grafana/runtime';
import { topicsWithNoResponse } from './testdata/topics_with_no_response';
import { consolidatedPageViews } from './testdata/consolidated_page_views';
import { topPublicUsers } from './testdata/top_public_users';

describe('DiscourseDatasource', () => {
  const instanceSettings: DataSourceInstanceSettings<DiscourseDataSourceOptions> = {
    id: 1,
    uid: '111',
    type: 'datasource',
    name: 'Discourse data source',
    url: '/api/datasources/proxy/1',
    meta: {} as PluginMeta,
    jsonData: {},
  };
  let ds: DiscourseDataSource;

  beforeEach(() => {
    ds = new DiscourseDataSource(instanceSettings);
  });

  describe('testDatasource', () => {
    describe('with a successful response', () => {
      beforeEach(() => {
        setupBackendSrv({
          url: '/api/datasources/proxy/1/discourse/admin/reports/topics_with_no_response.json',
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

  describe('query', () => {
    describe('for a report', () => {
      describe('with a Discourse API response that returns a single time series', () => {
        beforeEach(() => {
          setupBackendSrv({
            url:
              '/api/datasources/proxy/1/discourse/admin/reports/topics_with_no_response.json?start_date=2020-03-15&end_date=2020-03-22',
            response: topicsWithNoResponse,
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
            targets: [{ queryType: QueryType.Report, reportName: 'topics_with_no_response.json' }],
          } as DataQueryRequest<DiscourseQuery>;

          const result = await ds.query(options);
          expect(result.data[0].fields[0].name).toBe('time');
          expect(result.data[0].fields[1].name).toBe('value');
          expect(result.data[0].fields[1].config.displayName).toBe('Topics with no response');

          expect(result.data[0].fields[0].values.get(0)).toBe(1588284000000);
          expect(result.data[0].fields[1].values.get(0)).toBe(15);
          expect(result.data[0].fields[0].values.get(1)).toBe(1588370400000);
          expect(result.data[0].fields[1].values.get(1)).toBe(9);
        });
      });

      describe('with a Discourse API response that returns multiple time series', () => {
        beforeEach(() => {
          setupBackendSrv({
            url:
              '/api/datasources/proxy/1/discourse/admin/reports/consolidated_page_views.json?start_date=2020-07-01&end_date=2020-07-31',
            response: consolidatedPageViews,
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
          expect(result.data[0].fields[0].values.get(0)).toBe(1593554400000);
          expect(result.data[0].fields[1].values.get(0)).toBe(1815);
          expect(result.data[0].fields[0].values.get(1)).toBe(1593640800000);
          expect(result.data[0].fields[1].values.get(1)).toBe(1654);

          expect(result.data[1].fields[1].config.displayName).toBe('Anonymous users');
          expect(result.data[1].fields[0].values.get(0)).toBe(1593554400000);
          expect(result.data[1].fields[1].values.get(0)).toBe(23976);
          expect(result.data[1].fields[0].values.get(1)).toBe(1593640800000);
          expect(result.data[1].fields[1].values.get(1)).toBe(23847);

          expect(result.data[2].fields[1].config.displayName).toBe('Crawlers');
          expect(result.data[2].fields[0].values.get(0)).toBe(1593554400000);
          expect(result.data[2].fields[1].values.get(0)).toBe(10764);
          expect(result.data[2].fields[0].values.get(1)).toBe(1593640800000);
          expect(result.data[2].fields[1].values.get(1)).toBe(9104);
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
