import defaults from 'lodash/defaults';

import React, { PureComponent } from 'react';
import { InlineFormLabel, Select } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DiscourseDataSource } from './DataSource';
import { defaultQuery, DiscourseDataSourceOptions, DiscourseQuery } from './types';

interface State {
  reportOptions: Array<SelectableValue<string>>;
}
type Props = QueryEditorProps<DiscourseDataSource, DiscourseQuery, DiscourseDataSourceOptions>;

export class QueryEditor extends PureComponent<Props, State> {
  state: State = {
    reportOptions: [],
  };

  onReportChange = (reportName: string) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, reportName: reportName });

    // executes the query
    onRunQuery();
  };

  async componentDidMount() {
    try {
      const reportOptions = await this.props.datasource.getReportTypes();
      this.setState({ reportOptions: reportOptions });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { reportName } = query;

    return (
      <div className="gf-form">
        <div className="gf-form">
          <InlineFormLabel className="query-keyword" width={12}>
            Report Type
          </InlineFormLabel>
          <Select
            options={this.state.reportOptions}
            value={this.state.reportOptions.find(ro => ro.value === reportName)}
            onChange={report => {
              this.onReportChange(report.value || '');
            }}
          />
        </div>
      </div>
    );
  }
}
