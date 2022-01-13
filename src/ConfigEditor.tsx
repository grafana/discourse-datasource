import React, { PureComponent } from 'react';
import { DataSourceHttpSettings } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { DiscourseDataSourceOptions, DiscourseSecureJsonData } from './types';

interface Props extends DataSourcePluginOptionsEditorProps<DiscourseDataSourceOptions, DiscourseSecureJsonData> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {
  render() {
    const { options, onOptionsChange } = this.props;

    return (
      <>
        <DataSourceHttpSettings
          defaultUrl="http://localhost:9090"
          dataSourceConfig={options}
          showAccessOptions={true}
          onChange={onOptionsChange}
        />
      </>
    );
  }
}
