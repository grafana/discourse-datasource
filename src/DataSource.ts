import defaults from 'lodash/defaults';
import { getBackendSrv, getTemplateSrv } from '@grafana/runtime';

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

import flatten from './flatten';

import {
  DiscourseQuery,
  defaultQuery,
  DiscourseReports,
  DiscourseTags,
  QueryType,
  DiscourseCategories,
  DiscourseBulkReports,
  DiscourseReportMultipleData,
  DiscourseReportData,
  isDiscourseReportMultipleData,
  isDiscourseReportData,
} from './types';

export class DiscourseDataSource extends DataSourceApi<DiscourseQuery> {
  constructor(private instanceSettings: DataSourceInstanceSettings) {
    super(instanceSettings);
  }

  // entrypoint for queries
  async query(options: DataQueryRequest<DiscourseQuery>): Promise<DataQueryResponse> {
    const { range, scopedVars } = options;
    const from = range!.from.format('YYYY-MM-DD');
    const to = range!.to.format('YYYY-MM-DD');
    const data: DataQueryResponseData[] = [];

    // return a constant for each query.
    for (const target of options.targets) {
      const query = defaults(target, defaultQuery);

      if (query.hide) {
        continue;
      }

      if (query.queryType === QueryType.Report) {
        await this.executeReportQuery(query, from, to, data);
      } else if (query.queryType === QueryType.User) {
        await this.executeUserQuery(query, data);
      } else if (query.queryType === QueryType.Tags) {
        await this.executeTagsQuery(data);
      } else if (query.queryType === QueryType.Tag) {
        await this.executeTagQuery(query, data);
      } else if (query.queryType === QueryType.Search) {
        // support templated search queries
        const searchVar = getTemplateSrv().replace(query.searchQuery, scopedVars);
        await this.executeSearchQuery(searchVar, query, data);
      }
    }
    return { data };
  }

  // logic for the search API
  private async executeSearchQuery(searchVar: any, query: DiscourseQuery, data: any[]) {
    if (query.searchArea === 'topics_posts') {
      const filter = this.encodeFilter(searchVar, query);
      const result = await this.apiGet(`search.json?q=${filter}`);
      const firstTopics = result.data.topics;
      const moreTopics = result.data.grouped_search_result.more_full_page_results;

      // handle paginated search results as needed
      if (moreTopics === true && query.getPaginated === true) {
        const kind = 'search';
        const paginatedQuery = `search.json?q=${filter}&page=`;

        const allTopics = await this.paginatedResults(paginatedQuery, firstTopics, kind);

        data.push(allTopics);
      } else {
        const frame = toDataFrame(firstTopics);

        data.push(frame);
      }
    } else if (query.searchArea === 'users') {
      const result = await this.apiGet(`u/search/users.json?term=${query.searchQuery}`);
      const frame = toDataFrame(result.data.users);
      data.push(frame);
    } else {
      const result = await this.apiGet(`/tags/filter/search.json?limit=10&q=${query.searchQuery}`);
      const frame = toDataFrame(result.data.results);
      data.push(frame);
    }
  }

  // build URL-encoded filter
  private encodeFilter(search: any, query: DiscourseQuery) {
    let date = query.searchDate;
    let [category, tag, postedWhen, status, sort, author] = ['', '', '', '', '', ''];

    if (query.searchCategory !== '') {
      // add ' #' for category filter
      category = `%20%23${query.searchCategory}`;
    }

    if (query.searchTag !== '') {
      // add ' tags:' for tag filter
      tag = `%20tags:${query.searchTag}`;
    }

    if (query.searchPosted !== '') {
      // add ' {value}:' for postedWhen filter
      postedWhen = `%20${query.searchPosted}:`;
    } else {
      date = '';
    }

    if (query.searchSort !== '') {
      // add ' order:' for sort filter
      sort = `%20order:${query.searchSort}`;
    }

    if (query.searchStatus !== '') {
      // add ' status:' for status filter
      status = `%20status:${query.searchStatus}`;
    }

    if (query.searchAuthor !== '') {
      // add ' @' for author filter
      author = `%20%40${query.searchAuthor}`;
    }

    const filtr = `${search}${category}${tag}${postedWhen}${date}${status}${sort}${author}`;
    return filtr;
  }

  // pagination function for search api and tags api
  private async paginatedResults(paginatedQuery: string, firstTopics: any, kind: string) {
    let paginatedTopics: any[] = [];
    let nextResult = true;
    let data = {};

    // limit results to 10 pages total (500 for search, 300 for tag)
    // OR quit when nextResult returns null or undefined
    const maxPage = 10;
    for (let page = 1; page < maxPage && nextResult !== null && nextResult !== undefined; page++) {
      try {
        const request = await this.apiGet(`${paginatedQuery}${page}`);

        if (kind === 'search') {
          data = request.data.topics;
          nextResult = request.data.grouped_search_result.more_full_page_results;
        } else if (kind === 'tags') {
          data = request.data.topic_list.topics;
          nextResult = request.data.topic_list.more_topics_url;
        }

        paginatedTopics.push(data);
      } catch (err) {
        console.error(`Oops, something is wrong ${err}`);
      }
    }

    const dataFrame = toDataFrame(firstTopics.concat(paginatedTopics.flat()));

    return dataFrame;
  }

  // logic for the reporting API
  private async executeUserQuery(query: DiscourseQuery, data: any[]) {
    if (query.userQuery === 'topPublicUsers') {
      const result = await this.apiGet(`directory_items.json?period=${query.period || 'monthly'}&order=post_count`);
      const frame = toDataFrame(
        result.data.directory_items.reduce((arr: any, elem: any) => {
          arr.push(flatten(elem));
          return arr;
        }, [])
      );
      data.push(frame);
    } else {
      const result = await this.apiGet('admin/users/list/staff.json');
      const frame = toDataFrame(result.data);
      data.push(frame);
    }
  }

  // logic for the reporting API
  private async executeReportQuery(query: DiscourseQuery, from: string, to: string, data: any[]) {
    //strip the .json from the end
    const reportName = query.reportName?.substring(0, query.reportName.length - 5);
    const limit = 1000;

    let filter = `reports[${reportName}][start_date]=${from}&reports[${reportName}][end_date]=${to}&reports[${reportName}][limit]=${limit}`;

    if (query.category && query.category !== 'All categories') {
      filter += `&reports[${reportName}][filters][category]=${query.category}&reports[${reportName}][filters][include_subcategories]=true`;
    }

    const requestUrl = `admin/reports/bulk.json?${filter}`;

    const result = await this.apiGet(requestUrl);

    const reports = (result.data as DiscourseBulkReports).reports;
    let series = reports.filter((d: any) => d.data);
    const defaultReportTitle = reports.length > 0 ? reports[0].title : '';

    for (const s of series) {
      if (s.data?.length > 0 && isDiscourseReportMultipleData(s.data[0])) {
        for (const d of s.data as DiscourseReportMultipleData[]) {
          this.convertToDataFrame(query, d.data, d.label ?? defaultReportTitle, data);
        }
      } else if (s.data?.length > 0 && isDiscourseReportData(s.data[0])) {
        this.convertToDataFrame(query, s.data as DiscourseReportData[], defaultReportTitle, data);
      }
    }
  }

  // logic for the reporting API
  private convertToDataFrame(query: DiscourseQuery, d: DiscourseReportData[], displayName: string, data: any[]) {
    const frame = new MutableDataFrame({
      refId: query.refId,
      fields: [
        { name: 'time', type: FieldType.time },
        { name: 'value', type: FieldType.number, config: { displayName: displayName } },
      ],
    });

    for (const val of d) {
      frame.add({
        time: dateTimeParse(val.x, { timeZone: 'utc' }).valueOf(),
        value: val.y ?? 0,
      });
    }

    data.push(frame);
  }

  // logic for the tags (plural) API
  private async executeTagsQuery(data: any[]) {
    const result = await this.apiGet(`tags.json`);
    const frame = toDataFrame(result.data.tags);
    data.push(frame);
  }

  // logic for the tag (singular) API
  private async executeTagQuery(query: DiscourseQuery, data: any[]) {
    const result = await this.apiGet(`tag/${query.tag}.json`);
    const firstTopics = result.data.topic_list.topics;
    const moreTopics = result.data.topic_list.more_topics_url;

    // collect paginated results when needed
    if (query.getPaginated === true && moreTopics !== undefined) {
      const kind = 'tags';
      const paginatedQuery = `tag/${query.tag}.json?page=`;
      const allTopics = await this.paginatedResults(paginatedQuery, firstTopics, kind);
      data.push(allTopics);
    } else {
      data.push(firstTopics);
    }
  }

  // logic for populating the query editor with report options
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

  // logic for populating the query editor with category options
  async getCategories(): Promise<Array<SelectableValue<string>>> {
    const categoryOptions: Array<SelectableValue<string>> = [];
    categoryOptions.push({
      label: 'All categories',
      value: 'All categories',
      description: '',
      slug: '',
    });

    try {
      const result: any = await this.apiGet('categories.json');

      for (const category of (result.data as DiscourseCategories).category_list.categories) {
        categoryOptions.push({
          label: category.name,
          value: category.id.toString(),
          description: category.description,
          slug: category.slug,
        });
      }
    } catch (error) {
      console.log(error);
    }
    return categoryOptions;
  }

  // logic for populating the query editor with tag options
  async getTags(): Promise<Array<SelectableValue<any>>> {
    const tagOptions: Array<SelectableValue<any>> = [];
    tagOptions.push({
      label: 'All tags',
      value: 'All tags',
      slug: '',
    });

    try {
      const result: any = await this.apiGet('tags.json');

      for (const tag of (result.data as DiscourseTags).tags) {
        tagOptions.push({
          label: tag.text,
          value: tag.id.toString(),
          slug: tag.text,
        });
      }
    } catch (error) {
      console.log(error);
    }

    return tagOptions;
  }

  async testDatasource() {
    // if user adds credentials, test reporting API. Otherwise, test search API
    const headers = Object.values(this.instanceSettings.jsonData);

    if (headers.includes('Api-Key' && 'Api-Username')) {
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
    } else {
      let result: any;

      try {
        result = await this.apiGet('search.json?q=find-me-in-the-json');
      } catch (error) {
        console.log(error);
      }

      if (result?.data.grouped_search_result.term !== 'find-me-in-the-json') {
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
  }

  // TODO: .datasourceRequest is deprecated; switch to .fetch
  async apiGet(path: string): Promise<any> {
    const result = await getBackendSrv().datasourceRequest({
      url: `${this.instanceSettings.url}/${path}`,
      method: 'GET',
      params: this.query,
    });

    return result;
  }
}
