import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface DiscourseQuery extends DataQuery {
  queryType: string;
  reportName?: string;
  userQuery?: string;
  period?: string;
  category?: string;
  tagQuery?: string;
  tag?: any;
  searchCategory?: string;
  searchTag?: string;
  searchQuery?: string;
  searchPosted?: string;
  searchArea?: string;
  searchStatus?: string;
  searchSort?: string;
  searchDate?: any;
  searchAuthor?: any;
  getPaginated?: boolean;
}

export const defaultQuery: Partial<DiscourseQuery> = {
  // reporting API
  queryType: 'search',
  reportName: 'topics_with_no_response.json',
  userQuery: 'topPublicUsers',
  period: 'monthly',
  category: 'All categories',
  // tags API
  tagQuery: '',
  tag: '',
  //search API
  searchDate: '2022-01-01',
  searchCategory: '',
  searchTag: '',
  searchQuery: '',
  searchPosted: 'after',
  searchStatus: '',
  searchSort: 'latest',
  searchAuthor: '',
  searchArea: 'topics_posts',
  getPaginated: false,
};

export enum QueryType {
  Report = 'report',
  User = 'user',
  Tags = 'tags',
  Tag = 'tag',
  Search = 'search',
}

/**
 * These are options configured for each DataSource instance
 */
export interface DiscourseDataSourceOptions extends DataSourceJsonData {
  url?: string;
  username?: string;
}

export interface DiscourseSecureJsonData {
  apiKey?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
// export interface DiscourseSecureJsonData {
//   apiKey?: string;
// }

//Discourse API types
export interface DiscourseReports {
  reports: DiscourseReportType[];
}

export interface DiscourseReportType {
  type: string;
  title: string;
  description: string;
  description_link?: string;
}

export interface DiscourseTags {
  tags: DiscourseTag[];
}

export interface DiscourseTag {
  id: string;
  text: string;
  count: number;
  pm_count: number;
  target_tag?: any;
}

export interface DiscourseCategories {
  category_list: {
    categories: DiscourseCategory[];
  };
}

export interface DiscourseCategory {
  id: number;
  name: string;
  description: string;
  slug: string;
}

export interface DiscourseBulkReports {
  reports: DiscourseBulkReport[];
}

export interface DiscourseBulkReport {
  type: string;
  title: string;
  description: string;
  description_link?: string;
  data: DiscourseReportData[] | DiscourseReportMultipleData[];
  start_date: string;
  end_date: string;
  report_key: string;
  limit: number;
  total: number;
  average: boolean;
  percent: boolean;
  labels: DiscourseReportLabel[];
}

export interface DiscourseReportLabel {
  type: string;
  property: string;
  title: string;
}

export interface DiscourseReportMultipleData {
  req: string;
  label: string;
  data: DiscourseReportData[];
}

export const isDiscourseReportMultipleData = (data: any): data is DiscourseReportMultipleData =>
  data && data.hasOwnProperty('req');

export interface DiscourseReportData {
  x: string;
  y: number;
}

export const isDiscourseReportData = (data: any): data is DiscourseReportData => data && data.hasOwnProperty('x');
