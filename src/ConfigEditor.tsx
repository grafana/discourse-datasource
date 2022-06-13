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
      <div>
        <h3>
          <b>Using Hosted Discourse? Trying to Authenticate?</b>
        </h3>
        <h4>
          1: Click the <code>+ Add header</code> button twice.
        </h4>
        <h4>2: Now enter your credentials as follows:</h4>
        <p>
          <ul>
            <li>
              Header: <code>Api-Key</code> Value: <code>your-discourse-key</code>
            </li>
          </ul>
        </p>
        <p>
          <ul>
            <li>
              Header: <code>Api-Username</code> Value: <code>your-discourse-username</code>
            </li>
          </ul>
        </p>
      </div>
    </>
  );
};
