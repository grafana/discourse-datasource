import React, { PureComponent } from 'react';
import { InlineFormLabel, Select, QueryField, DatePickerWithInput, Input, InlineSwitch } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DiscourseDataSource } from './DataSource';
import { defaultQuery, DiscourseQuery, QueryType, normalizeQuery } from './types';

interface State {
  reportOptions: Array<SelectableValue<string>>;
  categoryOptions: Array<SelectableValue<string>>;
  tagOptions: Array<SelectableValue<any>>;
}
type Props = QueryEditorProps<DiscourseDataSource, DiscourseQuery>;

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
  { value: 'before', label: 'before' },
  { value: 'after', label: 'after' },
];

const searchAreaOptions = [
  { value: 'topics_posts', label: 'Topics/posts' },
  { value: 'categories_tags', label: 'Tags' },
  { value: 'users', label: 'Users' },
];

const searchStatusOptions = [
  { value: '', label: 'any' },
  { value: 'open', label: 'are open' },
  { value: 'closed', label: 'are closed' },
  { value: 'public', label: 'are public' },
  { value: 'archived', label: 'are archived' },
  { value: 'noreplies', label: 'have no replies' },
];

const searchSortOptions = [
  { value: '', label: 'Relevance' },
  { value: 'latest_topic', label: 'Latest Topic' },
  { value: 'latest', label: 'Latest Post' },
  { value: 'likes', label: 'Most Liked' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'votes', label: 'Most Votes' },
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

  onQueryTypeChange = (queryType: string) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, queryType: queryType });

    // executes the query
    onRunQuery();
  };

  // UI for search API
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

  onSearchTagChange = (searchTag: any) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, searchTag: searchTag });

    // executes the query
    onRunQuery();
  };

  onSearchPostedChange = (searchPosted: string) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, searchPosted: searchPosted });

    if (searchPosted === '') {
      onChange({ ...query, searchPosted: searchPosted, searchDate: '' });
    }
    // executes the query
    onRunQuery();
  };

  onSearchStatusChange = (searchStatus: string) => {
    const { onChange, query, onRunQuery } = this.props;
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

  onSearchAuthorChange = (searchAuthor: any) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, searchAuthor: searchAuthor });

    // executes the query
    onRunQuery();
  };

  onSearchCategoryChange = (searchCategory: string) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, searchCategory: searchCategory });

    // executes the query
    onRunQuery();
  };

  onSearchDateChange = (date: any) => {
    const { onChange, query, onRunQuery } = this.props;
    let newDate = '';
    if (date !== '') {
      const [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
      newDate = `${year}-${month}-${day}`;
      console.log(newDate);
    }
    onChange({ ...query, searchDate: newDate });

    // executes the query
    onRunQuery();
  };

  // UI for reporting API
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

  // UI for tag API
  onTagChange = (tag?: any) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, tag: tag });

    // executes the query
    onRunQuery();
  };

  onPaginationChange = (newValue: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({
      ...query,
      getPaginated: newValue.target.checked,
    });

    // executes the query
    onRunQuery();
  };

  async componentDidMount() {
    try {
      const reportOptions = await this.props.datasource.getReportTypes();
      const categoryOptions = await this.props.datasource.getCategories();
      const tagOptions = await this.props.datasource.getTags();
      this.setState({ reportOptions: reportOptions, categoryOptions: categoryOptions, tagOptions: tagOptions });
      const query = normalizeQuery(this.props.query);
      this.props.onChange(query);
      this.props.onRunQuery();
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const query = normalizeQuery(this.props.query);
    const {
      queryType,
      reportName,
      userQuery,
      period,
      category,
      tag,
      searchCategory,
      searchTag,
      searchArea,
      searchPosted,
      searchStatus,
      searchSort,
      searchDate,
      searchAuthor,
      searchQuery,
      getPaginated,
    } = query;

    return (
      <div>
        <div className="gf-form">
          <InlineFormLabel className="query-keyword" width={6}>
            Query Type
          </InlineFormLabel>
          <Select
            width={30}
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
              allowCustomValue={true}
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
            <InlineFormLabel className="query-keyword" width={9}>
              Get paginated results?
            </InlineFormLabel>
            <InlineSwitch value={getPaginated} onChange={this.onPaginationChange} />
          </div>
        )}
        {queryType === QueryType.Search && (
          <div>
            <div className="gf-form">
              <InlineFormLabel className="query-keyword" width={6}>
                Query
              </InlineFormLabel>
              <QueryField
                // additionalPlugins={plugins}
                // cleanText={cleanText}
                // onTypeahead={onTypeahead}
                // onRunQuery={onBlur}
                query={searchQuery}
                onChange={this.onSearchQueryChange}
                portalOrigin=""
                placeholder="search Discourse"
              />
            </div>
            <div className="gf-form">
              <InlineFormLabel className="query-keyword" width={6}>
                Search in
              </InlineFormLabel>
              <Select
                width={30}
                options={searchAreaOptions}
                value={searchAreaOptions.find((to) => to.value === searchArea)}
                onChange={(s) => {
                  this.onSearchAreaChange(s.value || defaultQuery.searchArea || '');
                }}
              />
              <InlineFormLabel className="query-keyword" width={9}>
                Get paginated results?
              </InlineFormLabel>
              <InlineSwitch value={getPaginated} onChange={this.onPaginationChange} />
            </div>
            {searchArea === 'topics_posts' && (
              <div>
                <div className="gf-form">
                  <InlineFormLabel className="query-keyword" width={6}>
                    Categorized
                  </InlineFormLabel>
                  <Select
                    width={30}
                    options={this.state.categoryOptions}
                    value={this.state.categoryOptions.find((co) => co.slug === searchCategory)}
                    onChange={(searchCategory) => {
                      this.onSearchCategoryChange(searchCategory.slug || defaultQuery.searchCategory || '');
                    }}
                    allowCustomValue={true}
                  />
                  <InlineFormLabel className="query-keyword" width={6}>
                    Tagged
                  </InlineFormLabel>
                  <Select
                    width={40}
                    options={this.state.tagOptions}
                    value={this.state.tagOptions.find((to) => to.slug === searchTag)}
                    onChange={(t) => {
                      this.onSearchTagChange(t.slug || defaultQuery.searchTag || '');
                    }}
                  />
                </div>
                <div className="gf-form">
                  <InlineFormLabel className="query-keyword" width={6}>
                    Time Posted
                  </InlineFormLabel>
                  <Select
                    width={14}
                    options={searchPostedOptions}
                    value={searchPostedOptions.find((po) => po.value === searchPosted)}
                    onChange={(p) => {
                      this.onSearchPostedChange(p.value || '');
                    }}
                  />
                  <DatePickerWithInput
                    width={16}
                    closeOnSelect={true}
                    value={searchDate}
                    onChange={(d) => {
                      this.onSearchDateChange(d);
                    }}
                  />
                  <InlineFormLabel className="query-keyword" width={6}>
                    Posted by
                  </InlineFormLabel>
                  <Input
                    width={40}
                    placeholder="anyone"
                    value={searchAuthor}
                    onChange={(e) => this.onSearchAuthorChange(e.currentTarget.value)}
                  />
                </div>
                <div className="gf-form">
                  <InlineFormLabel className="query-keyword" width={6}>
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
                  <InlineFormLabel className="query-keyword" width={6}>
                    Sort by
                  </InlineFormLabel>
                  <Select
                    width={40}
                    options={searchSortOptions}
                    value={searchSortOptions.find((so) => so.value === searchSort)}
                    onChange={(s) => {
                      this.onSearchSortChange(s.value || '');
                    }}
                    allowCustomValue={true}
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
