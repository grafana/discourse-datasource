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
  SelectableValue,
  toDataFrame,
} from '@grafana/data';

import { DiscourseQuery, DiscourseDataSourceOptions, defaultQuery, DiscourseReports } from './types';

export class DiscourseDataSource extends DataSourceApi<DiscourseQuery, DiscourseDataSourceOptions> {
  constructor(private instanceSettings: DataSourceInstanceSettings<DiscourseDataSourceOptions>) {
    super(instanceSettings);
  }

  async query(options: DataQueryRequest<DiscourseQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.format('YYYY-MM-DD');
    const to = range!.to.format('YYYY-MM-DD');

    const data: DataQueryResponseData[] = [];

    // Return a constant for each query.
    for (const target of options.targets) {
      const query = defaults(target, defaultQuery);
      if (query.hide) {
        continue;
      }

      const result = await this.apiGet(`admin/reports/${query.reportName}?start_date=${from}&end_date=${to}`);

      let series = result.data.report.data.filter((d: any) => d.data);
      if (series.length === 0) {
        series = [result.data.report];
      }

      //If single time series, then use the report title for the series alias
      let displayName;
      if (result?.data?.report?.data?.length > 0 && !result.data.report.data[0].data) {
        displayName = result?.data?.report?.title;
      }

      for (const s of series) {
        if (s.data.length > 0 && s.data[0].x && s.data[0].y) {
          const frame = new MutableDataFrame({
            refId: query.refId,
            fields: [
              { name: 'time', type: FieldType.time },
              { name: 'value', type: FieldType.number, config: { displayName: displayName ?? s.label } },
            ],
          });

          for (const val of s.data) {
            frame.add({ time: dateTimeParse(val.x).valueOf(), value: val.y ?? 0 });
          }

          data.push(frame);
        } else if (s.data.length > 0) {
          const frame = toDataFrame(s.data);
          data.push(frame);
        }
      }
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

  async getReportTypes(): Promise<Array<SelectableValue<string>>> {
    const reportOptions: Array<SelectableValue<string>> = [];
    try {
      const result: any = await this.apiGet('admin/reports.json');

      for (const rep of (result.data as DiscourseReports).reports) {
        reportOptions.push({
          label: rep.title,
          value: rep.type + '.json',
          description: rep.description,
        });
      }
    } catch (error) {
      console.log(error);
    }

    return reportOptions;
  }

  async apiGet(path: string): Promise<any> {
    const result = await getBackendSrv().datasourceRequest({
      url: `${this.instanceSettings.url}/discourse/${path}`,
      method: 'GET',
    });

    return result;
  }
}
