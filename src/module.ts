import { DataSourcePlugin } from '@grafana/data';
import { DiscourseDataSource } from './DataSource';
import { ConfigEditor } from './ConfigEditor';
import { QueryEditor } from './QueryEditor';
// import { DiscourseQuery, DiscourseDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<DiscourseDataSource>(
  DiscourseDataSource
)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
