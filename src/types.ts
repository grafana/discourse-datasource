import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MyQuery extends DataQuery {
  type: string;
  reportName: string;
}

export const defaultQuery: Partial<MyQuery> = {
  type: 'reports',
  reportName: 'topics_with_no_response.json',
};

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
