import defaults from 'lodash/defaults';

import React, { PureComponent } from 'react';
import { InlineFormLabel, Select, HorizontalGroup } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DiscourseDataSource } from './DataSource';
import { defaultQuery, DiscourseDataSourceOptions, DiscourseQuery, QueryType } from './types';

interface State {
  reportOptions: Array<SelectableValue<string>>;
  categoryOptions: Array<SelectableValue<string>>;
  tagOptions: Array<SelectableValue<any>>;
}
type Props = QueryEditorProps<DiscourseDataSource, DiscourseQuery, DiscourseDataSourceOptions>;

const queryTypeOptions = [
  { value: QueryType.Report, label: 'Report', description: 'Discourse admin reports' },
  { value: QueryType.User, label: 'User', description: 'User statistics' },
  { value: QueryType.Tags, label: 'Tags (overview)', description: 'shows all tags and counts' },
  { value: QueryType.Tag, label: 'Tag (detailed)', description: 'shows detailed stats per-tag' },

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
    categoryOptions: [],
    tagOptions: [],
  };

  onReportChange = (reportName: string) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, reportName: reportName });

    // executes the query
    onRunQuery();
  };

  onCategoryChange = (category: string) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, category: category });

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

  onTagChange = (tag?: any) => {
    if (!tag) {
      return;
    }

    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, tag: tag });

    // executes the query
    onRunQuery();
  };

  async componentDidMount() {
    try {
      const reportOptions = await this.props.datasource.getReportTypes();
      const categoryOptions = await this.props.datasource.getCategories();
      const tagOptions = await this.props.datasource.getTags();
      this.setState({ reportOptions: reportOptions, categoryOptions: categoryOptions, tagOptions: tagOptions });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { queryType, reportName, userQuery, period, category, tag } = query;

    return (
      <HorizontalGroup>
        <div className="gf-form">
          <InlineFormLabel className="query-keyword" width={10}>
            Query Type
          </InlineFormLabel>
          <Select
            width={25}
            options={queryTypeOptions}
            value={queryTypeOptions.find((ro) => ro.value === queryType)}
            onChange={(q) => {
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
              value={this.state.reportOptions.find((ro) => ro.value === reportName)}
              onChange={(report) => {
                this.onReportChange(report.value || defaultQuery.reportName || '');
              }}
            />
            <InlineFormLabel className="query-keyword" width={7}>
              Category
            </InlineFormLabel>
            <Select
              width={30}
              options={this.state.categoryOptions}
              value={this.state.categoryOptions.find((co) => co.value === category)}
              onChange={(category) => {
                this.onCategoryChange(category.value || defaultQuery.category || '');
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
              value={userQueryOptions.find((o) => o.value === userQuery)}
              onChange={(q) => {
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
              value={periodOptions.find((po) => po.value === period)}
              onChange={(p) => {
                this.onPeriodChange(p.value);
              }}
            />
          </div>
        )}
        {queryType === QueryType.Tag && (
          <div className="gf-form">
            <InlineFormLabel className="query-keyword" width={7}>
              Tags
            </InlineFormLabel>
            <Select
              width={30}
              options={this.state.tagOptions}
              value={this.state.tagOptions.find((to) => to.value === tag)}
              onChange={(tag) => {
                this.onTagChange(tag.value || defaultQuery.tag || '');
              }}
            />
          </div>
          )}
      </HorizontalGroup>
    );
  }
}
