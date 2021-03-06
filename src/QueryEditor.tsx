import defaults from 'lodash/defaults';

import React, { PureComponent } from 'react';
import { InlineFormLabel, Select, HorizontalGroup } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DiscourseDataSource } from './DataSource';
import { defaultQuery, DiscourseDataSourceOptions, DiscourseQuery, QueryType } from './types';

interface State {
  reportOptions: Array<SelectableValue<string>>;
}
type Props = QueryEditorProps<DiscourseDataSource, DiscourseQuery, DiscourseDataSourceOptions>;

const queryTypeOptions = [
  { value: QueryType.Report, label: 'Report', description: 'Discourse admin reports' },
  { value: QueryType.User, label: 'User', description: 'User statistics' },
];

const userQueryOptions = [
  { value: 'topPublicUsers', label: 'Top Public Users', description: 'Users who are replying most frequently' },
  { value: 'staff', label: 'Staff', description: 'Statistics for staff users' },
];

const periodOptions = [
  { value: 'all', label: 'All Time' },
  { value: 'daily', label: 'Today' },
  { value: 'weekly', label: 'Week' },
  { value: 'monthly', label: 'Month' },
  { value: 'quarterly', label: 'Quarter' },
  { value: 'yearly', label: 'Year' },
];

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

  onQueryTypeChange = (queryType: string) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, queryType: queryType });

    // executes the query
    onRunQuery();
  };

  onUserQueryChange = (userQuery?: string) => {
    if (!userQuery) {
      return;
    }

    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, userQuery: userQuery });

    // executes the query
    onRunQuery();
  };

  onPeriodChange = (period?: string) => {
    if (!period) {
      return;
    }

    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, period: period });

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
    const { queryType, reportName, userQuery, period } = query;

    return (
      <HorizontalGroup>
        <div className="gf-form">
          <InlineFormLabel className="query-keyword" width={7}>
            Query Type
          </InlineFormLabel>
          <Select
            width={12}
            options={queryTypeOptions}
            value={queryTypeOptions.find(ro => ro.value === queryType)}
            onChange={q => {
              this.onQueryTypeChange(q.value || defaultQuery.queryType || QueryType.Report);
            }}
          />
        </div>
        {queryType === QueryType.Report && (
          <div className="gf-form">
            <InlineFormLabel className="query-keyword" width={7}>
              Report Type
            </InlineFormLabel>
            <Select
              width={30}
              options={this.state.reportOptions}
              value={this.state.reportOptions.find(ro => ro.value === reportName)}
              onChange={report => {
                this.onReportChange(report.value || defaultQuery.reportName || '');
              }}
            />
          </div>
        )}
        {queryType === QueryType.User && (
          <div className="gf-form">
            <InlineFormLabel className="query-keyword" width={7}>
              User Query
            </InlineFormLabel>
            <Select
              width={20}
              options={userQueryOptions}
              value={userQueryOptions.find(o => o.value === userQuery)}
              onChange={q => {
                this.onUserQueryChange(q.value);
              }}
            />
          </div>
        )}
        {queryType === QueryType.User && userQuery === 'topPublicUsers' && (
          <div className="gf-form">
            <InlineFormLabel className="query-keyword" width={7}>
              Period
            </InlineFormLabel>
            <Select
              width={12}
              options={periodOptions}
              value={periodOptions.find(po => po.value === period)}
              onChange={p => {
                this.onPeriodChange(p.value);
              }}
            />
          </div>
        )}
      </HorizontalGroup>
    );
  }
}
