import React from 'react';
import { DataSourceHttpSettings } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { DiscourseDataSourceOptions } from './types';

interface Props extends DataSourcePluginOptionsEditorProps<DiscourseDataSourceOptions> {}

export const ConfigEditor = (props: Props) => {
  const { options, onOptionsChange } = props;
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
};
