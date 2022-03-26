import React from 'react';
import { DataSourceHttpSettings } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';

export type Props = DataSourcePluginOptionsEditorProps;

export const ConfigEditor: React.FC<Props> = ({ options, onOptionsChange }) => {
  return (
    <>
      <DataSourceHttpSettings
        defaultUrl="https://community.grafana.com"
        dataSourceConfig={options}
        showAccessOptions={false}
        onChange={onOptionsChange}
      />
    </>
  );
};
