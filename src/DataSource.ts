import defaults from 'lodash/defaults';
import { getBackendSrv } from '@grafana/runtime';

import {
  DataQueryRequest,
  dateTimeParse,
  DataQueryResponse,
  DataQueryResponseData,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

import { MyQuery, DiscourseDataSourceOptions, defaultQuery } from './types';

export class DiscourseDataSource extends DataSourceApi<MyQuery, DiscourseDataSourceOptions> {
  constructor(private instanceSettings: DataSourceInstanceSettings<DiscourseDataSourceOptions>) {
    super(instanceSettings);
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.format('YYYY-MM-DD');
    const to = range!.to.format('YYYY-MM-DD');

    const data: DataQueryResponseData[] = [];

    // Return a constant for each query.
    for (const target of options.targets) {
      const query = defaults(target, defaultQuery);

      const result = await this.apiGet(`admin/${query.type}/${query.reportName}?start_date=${from}&end_date=${to}`);

      const frame = new MutableDataFrame({
        refId: query.refId,
        fields: [
          { name: 'time', type: FieldType.time },
          { name: 'value', type: FieldType.number },
        ],
      });

      for (const val of result.data.report.data) {
        frame.add({ time: dateTimeParse(val.x).valueOf(), value: val.y });
      }

      data.push(frame);
    }

    return { data };
  }

  async testDatasource() {
    let result: any;

    try {
      result = await this.apiGet('admin/reports/topics_with_no_response.json');
    } catch (error) {
      console.log(error);
    }

    if (result?.data?.report?.title !== 'Topics with no response') {
      return {
        status: 'error',
        message: 'Invalid credentials. Failed with request to the Discourse API',
      };
    }

    return {
      status: 'success',
      message: 'Success',
    };
  }

  async apiGet(path: string): Promise<any> {
    const result = await getBackendSrv().datasourceRequest({
      url: `${this.instanceSettings.url}/discourse/${path}`,
      method: 'GET',
    });

    return result;
  }
}
