import React from 'react';
import { DataSourceHttpSettings } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { DiscourseDataSourceOptions, DiscourseSecureJsonData } from './types';

interface Props extends DataSourcePluginOptionsEditorProps<DiscourseDataSourceOptions, DiscourseSecureJsonData> {}

export const ConfigEditor: React.FC<Props> = ({ options, onOptionsChange }) => {
  return (
    <>
      <DataSourceHttpSettings
        defaultUrl="http://localhost:16686"
        dataSourceConfig={options}
        showAccessOptions={false}
        onChange={onOptionsChange}
      />
    </>
  )
// export class ConfigEditor extends PureComponent<Props, State> {
//   render() {
//     const { options, onOptionsChange } = this.props;

//     return (
//       <>
//         <DataSourceHttpSettings
//           defaultUrl="http://localhost:9090"
//           dataSourceConfig={options}
//           showAccessOptions={true}
//           onChange={onOptionsChange}
//         />
//       </>
//     );
//   }
}
