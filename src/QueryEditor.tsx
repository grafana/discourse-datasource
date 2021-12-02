import defaults from 'lodash/defaults';

import React, { PureComponent } from 'react';
import { InlineFormLabel, Select, QueryField, HorizontalGroup, InlineFieldRow } from '@grafana/ui';
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
  { value: QueryType.Search, label: 'Search', description: 'Native search engine' },

];

const userQueryOptions = [
  { value: 'topPublicUsers', label: 'Top Public Users', description: 'Users who are replying most frequently' },
  { value: 'staff', label: 'Staff', description: 'Statistics for staff users' },
];

const searchQueryOptions = [
  { value: 'alerting', label: 'alerting' },
  { value: 'templating', label: 'templating' },
];
const searchPostedOptions = [
  { value: 'before', label: 'before' },
  { value: 'after', label: 'after' },
];
const searchAreaOptions = [
  { value: 'topics_posts', label: 'Topics/posts' },
  { value: 'categories_tags', label: 'Categories/tags' },
  { value: 'users', label: 'Users' },
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

  onSearchQueryChange = (searchQuery?: string) => {
    if (!searchQuery) {
      return;
    }

    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, searchQuery: searchQuery });

    // executes the query
    onRunQuery();
  };

  onSearchAreaChange = (searchArea?: string) => {
    if (!searchArea) {
      return;
    }

    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, searchArea: searchArea });

    // executes the query
    onRunQuery();
  };

  onSearchBeforeOrAfter = (searchPosted?: string) => {
    if (!searchPosted) {
      return;
    }

    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, searchPosted: searchPosted });

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
    const { queryType, reportName, userQuery, period, category, tag, searchQuery, searchPosted, searchArea } = query;

    return (
      <div>
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
        {queryType === QueryType.Search && (
          <div>
            <div className="gf-form">
              <InlineFormLabel className="query-keyword" width={7}>
                Query
              </InlineFormLabel>
              <QueryField
                // additionalPlugins={plugins}
                // query={query}
                // cleanText={cleanText}
                // onTypeahead={onTypeahead}
                // onRunQuery={onBlur}
                // onChange={onChange}
                portalOrigin="jsonapi"
                placeholder="search Discourse"
              />
              {/* <Select
              width={30}
              options={searchQueryOptions}
              value={searchQueryOptions.find((qo) => qo.value === searchQuery)}
              onChange={(q) => {
                this.onSearchQueryChange(q.value);
              }}
              /> */}
              <InlineFormLabel className="query-keyword" width={7}>
                Area
              </InlineFormLabel>
              <Select
                width={30}
                options={searchAreaOptions}
                value={searchAreaOptions.find((ao) => ao.value === searchArea)}
                onChange={(a) => {
                  this.onSearchAreaChange(a.value);
                }}
              />
            </div>
            <div className="gf-form">
              <InlineFormLabel className="query-keyword" width={7}>
                Categorized
              </InlineFormLabel>
              <Select
                width={30}
                options={this.state.categoryOptions}
                value={this.state.categoryOptions.find((co) => co.value === category)}
                onChange={(category) => {
                  this.onCategoryChange(category.value || defaultQuery.category || '');
                }}
              />
              <InlineFormLabel className="query-keyword" width={7}>
                Where topics
              </InlineFormLabel>
              {/* <Select
                width={30}
                options={this.state.tagOptions}
                value={this.state.tagOptions.find((to) => to.value === tag)}
                onChange={(tag) => {
                  this.onTagChange(tag.value || defaultQuery.tag || '');
                }}
              /> */}
            </div>            
            <div className="gf-form">
              <InlineFormLabel className="query-keyword" width={7}>
                Tagged
              </InlineFormLabel>
              <Select
                width={30}
                options={this.state.tagOptions}
                value={this.state.tagOptions.find((to) => to.value === tag)}
                onChange={(tag) => {
                  this.onTagChange(tag.value || defaultQuery.tag || '');
                }}
              />
              <InlineFormLabel className="query-keyword" width={7}>
                Posted by
              </InlineFormLabel>
              {/* <Select
                width={30}
                options={this.state.tagOptions}
                value={this.state.tagOptions.find((to) => to.value === tag)}
                onChange={(tag) => {
                  this.onTagChange(tag.value || defaultQuery.tag || '');
                }}
              /> */}
            </div>
            <div className="gf-form">
              <InlineFormLabel className="query-keyword" width={7}>
                Return Only...
              </InlineFormLabel>
              {/* <Select
                width={30}
                options={this.state.categoryOptions}
                value={this.state.categoryOptions.find((co) => co.value === category)}
                onChange={(category) => {
                  this.onCategoryChange(category.value || defaultQuery.category || '');
                }}
              /> */}
              <InlineFormLabel className="query-keyword" width={7}>
                Posted
              </InlineFormLabel>
              <Select
              width={12}
              options={searchPostedOptions}
              value={searchPostedOptions.find((po) => po.value === searchPosted)}
              onChange={(p) => {
                this.onSearchBeforeOrAfter(p.value);
              }}
              />
              <InlineFormLabel className="query-keyword" width={7}>
                Calendar
              </InlineFormLabel>
              {/* <Select
                width={30}
                options={this.state.tagOptions}
                value={this.state.tagOptions.find((to) => to.value === tag)}
                onChange={(tag) => {
                  this.onTagChange(tag.value || defaultQuery.tag || '');
                }}
              /> */}
            </div>
          </div>
          )}
      </div>
    );
  }
}
