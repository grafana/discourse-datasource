import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface DiscourseQuery extends DataQuery {
  queryType: string;
  reportName?: string;

  userQuery?: string;
  period?: string;
  category?: string;

  tagQuery?: string;
  tag?: any;
}

export const defaultQuery: Partial<DiscourseQuery> = {
  queryType: 'report',
  reportName: 'topics_with_no_response.json',
  userQuery: 'topPublicUsers',
  period: 'monthly',
  category: 'All categories',
  tagQuery: '',
  tag: 'backend-platform'
};

export enum QueryType {
  Report = 'report',
  User = 'user',
  Tags = 'tags',
  Tag  = 'tag'
}

/**
 * These are options configured for each DataSource instance
 */
export interface DiscourseDataSourceOptions extends DataSourceJsonData {
  url?: string;
  username?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface DiscourseSecureJsonData {
  apiKey?: string;
}

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
