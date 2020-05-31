import { DiscourseDataSource } from './DataSource';
import { DiscourseDataSourceOptions } from './types';
import { DataSourceInstanceSettings, PluginMeta } from '@grafana/data';
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
