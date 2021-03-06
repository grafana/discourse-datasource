import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface DiscourseQuery extends DataQuery {
  queryType: string;
  reportName?: string;

  userQuery?: string;
  period?: string;
}

export const defaultQuery: Partial<DiscourseQuery> = {
  queryType: 'report',
  reportName: 'topics_with_no_response.json',
  userQuery: 'topPublicUsers',
  period: 'monthly',
};

export enum QueryType {
  Report = 'report',
  User = 'user',
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
