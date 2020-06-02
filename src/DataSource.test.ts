import { DiscourseDataSource } from './DataSource';
import { DiscourseDataSourceOptions, MyQuery } from './types';
import { DataQueryRequest, DataSourceInstanceSettings, PluginMeta, toUtc } from '@grafana/data';
import { BackendSrv, BackendSrvRequest, setBackendSrv } from '@grafana/runtime';
import { topicsWithNoResponse } from './testdata/topics_with_no_response';

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
    describe('', () => {
      beforeEach(() => {
        setupBackendSrv({
          url:
            '/api/datasources/proxy/1/discourse/admin/reports/topics_with_no_response.json?start_date=2020-03-15&end_date=2020-03-22',
          response: topicsWithNoResponse,
        });
      });

      it('should return data frames', async () => {
        const options = {
          range: {
            from: toUtc('2020-03-15T20:00:00Z'),
            to: toUtc('2020-03-22T23:59:00Z'),
          },
          rangeRaw: {
            from: 'now-4h',
            to: 'now',
          },
          targets: [{ type: 'reports', reportName: 'topics_with_no_response.json' }],
        } as DataQueryRequest<MyQuery>;

        const result = await ds.query(options);
        expect(result.data[0].fields[0].name).toBe('time');
        expect(result.data[0].fields[1].name).toBe('value');

        expect(result.data[0].fields[0].values.get(0)).toBe(1588284000000);
        expect(result.data[0].fields[1].values.get(0)).toBe(15);
        expect(result.data[0].fields[0].values.get(1)).toBe(1588370400000);
        expect(result.data[0].fields[1].values.get(1)).toBe(9);
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
