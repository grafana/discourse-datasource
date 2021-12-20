import defaults from 'lodash/defaults';
import React, { PureComponent } from 'react';
import { InlineFormLabel, Select, QueryField, DatePickerWithInput, Input } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DiscourseDataSource } from './DataSource';
import { defaultQuery, DiscourseDataSourceOptions, DiscourseQuery, QueryType } from './types';
// import { isDate, isString } from 'lodash';

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

const searchPostedOptions = [
  { value: '', label: 'any' },
  { value: '%20before:', label: 'before' },
  // { value: '%20before:2021-5-31', label: 'before' },
  // Tue Dec 14 2021 00:00:00 GMT-1000 (Hawaii-Aleutian Standard Time)
  { value: '%20after:', label: 'after' },
];

const searchAreaOptions = [
  { value: 'topics_posts', label: 'Topics/posts' },
  { value: 'categories_tags', label: 'Tags' },
  { value: 'users', label: 'Users' },
];

// in datasource file: if value = any then return ... else ... (make one validation function for all)
const searchStatusOptions = [
  { value: '', label: 'any' },
  { value: '%20status:open', label: 'are open' },
  { value: '%20status:closed', label: 'are closed' },
  { value: '%20status:public', label: 'are public' },
  { value: '%20status:archived', label: 'are archived' },
  { value: '%20status:noreplies', label: 'have no replies' },
];

// same; remove encoding here and add it to search logic
const searchSortOptions = [
  { value: '', label: 'Relevance' },
  { value: '%20order:latest_topic', label: 'Latest Topic' },
  { value: '%20order:latest', label: 'Latest Post' },
  { value: '%20order:likes', label: 'Most Liked' },
  { value: '%20order:views', label: 'Most Viewed' },
  { value: '%20order:votes', label: 'Most Votes' },
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

  onSearchQueryChange = (searchQuery: string) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, searchQuery: searchQuery });

    // executes the query
    onRunQuery();
  };

  onSearchAreaChange = (searchArea: string) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, searchArea: searchArea });

    // executes the query
    onRunQuery();
  };

  onSearchPostedChange = (searchPosted: string) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, searchPosted: searchPosted });

    // executes the query
    onRunQuery();
  };

  onSearchStatusChange = (searchStatus: string) => {
    const { onChange, query, onRunQuery } = this.props;
    console.log(searchStatus);
    onChange({ ...query, searchStatus: searchStatus });

    // executes the query
    onRunQuery();
  };

  onSearchSortChange = (searchSort: string) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, searchSort: searchSort });

    // executes the query
    onRunQuery();
  };

  onSearchAuthorChange = (searchAuthor: React.FormEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, searchAuthor: searchAuthor });

    // executes the query
    onRunQuery();
  };

  onDatePickerChange = (date: any) => {
    console.log(date)
    const baz = date.toString()
    console.log(baz)
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, searchDate: date });

    // executes the query
    onRunQuery();
  };

  onCategoryChange = (category: string) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, category: category });

    // executes the query
    onRunQuery();
  };

  onSearchCategoryChange = (categorySlug: string) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, categorySlug: categorySlug });

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
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, tag: tag });

    // executes the query
    onRunQuery();
  };

  onTagSlugChange = (tagSlug?: any) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, tagSlug: tagSlug });

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
    const {
      queryType,
      reportName,
      userQuery,
      period,
      category,
      categorySlug,
      tag,
      tagSlug,
      searchArea,
      searchPosted,
      searchStatus,
      searchSort,
      searchDate,
      searchAuthor,
    } = query;

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
              <InlineFormLabel className="query-keyword" width={10}>
                Query
              </InlineFormLabel>
              <QueryField
                // additionalPlugins={plugins}
                // cleanText={cleanText}
                // onTypeahead={onTypeahead}
                // onRunQuery={onBlur}
                onChange={this.onSearchQueryChange}
                portalOrigin=""
                placeholder="search Discourse"
              />
              <InlineFormLabel className="query-keyword" width={10}>
                Search in
              </InlineFormLabel>
              <Select
                width={42}
                options={searchAreaOptions}
                value={searchAreaOptions.find((to) => to.value === searchArea)}
                onChange={(s) => {
                  this.onSearchAreaChange(s.value || defaultQuery.searchArea || '');
                }}
              />
            </div>
            {searchArea === 'topics_posts' && (
              <div>
                <div className="gf-form">
                  <InlineFormLabel className="query-keyword" width={10}>
                    Categorized
                  </InlineFormLabel>
                  <Select
                    width={30}
                    options={this.state.categoryOptions}
                    value={this.state.categoryOptions.find((co) => co.slug === categorySlug)}
                    onChange={(c) => {
                      this.onSearchCategoryChange(c.slug || defaultQuery.categorySlug || '');
                    }}
                  />
                  <InlineFormLabel className="query-keyword" width={10}>
                    Tagged
                  </InlineFormLabel>
                  <Select
                    width={40}
                    options={this.state.tagOptions}
                    value={this.state.tagOptions.find((to) => to.slug === tagSlug)}
                    onChange={(t) => {
                      this.onTagSlugChange(t.slug || defaultQuery.tagSlug || '');
                    }}
                  />
                </div>
                <div className="gf-form">
                  <InlineFormLabel className="query-keyword" width={10}>
                    Time Posted
                  </InlineFormLabel>
                  <Select
                    width={10}
                    options={searchPostedOptions}
                    value={searchPostedOptions.find((po) => po.value === searchPosted)}
                    onChange={(p) => {
                      this.onSearchPostedChange(p.value || defaultQuery.searchPosted || '');
                    }}
                  />
                  <DatePickerWithInput
                    width={20}
                    closeOnSelect={true}
                    value={searchDate}
                    onChange={(date) => {
                      this.onDatePickerChange(date);
                    }}
                  />
                  <InlineFormLabel className="query-keyword" width={10}>
                    Posted by
                  </InlineFormLabel>
                  <Input
                    width={40}
                    placeholder="anyone"
                    value={searchAuthor}
                    onChange={(author) => {
                      this.onSearchAuthorChange(author);
                    }}
                  />
                </div>
                <div className="gf-form">
                  <InlineFormLabel className="query-keyword" width={10}>
                    Topic Status
                  </InlineFormLabel>
                  <Select
                    width={30}
                    options={searchStatusOptions}
                    value={searchStatusOptions.find((so) => so.value === searchStatus)}
                    onChange={(s) => {
                      this.onSearchStatusChange(s.value || defaultQuery.searchStatus || '');
                    }}
                  />
                  <InlineFormLabel className="query-keyword" width={10}>
                    Sort by
                  </InlineFormLabel>
                  <Select
                    width={40}
                    options={searchSortOptions}
                    value={searchSortOptions.find((so) => so.value === searchSort)}
                    onChange={(s) => {
                      this.onSearchSortChange(s.value || defaultQuery.searchSort || '');
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
