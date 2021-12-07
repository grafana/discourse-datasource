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
        // sigV4AuthEnabled={false}
      />

      {/* Additional configuration settings for your data source plugin.*/}
    </>
  );
};



// import React, { ChangeEvent, PureComponent } from 'react';
// import { LegacyForms } from '@grafana/ui';
// import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
// import { DiscourseDataSourceOptions } from './types';

// const { FormField } = LegacyForms;

// interface Props extends DataSourcePluginOptionsEditorProps<DiscourseDataSourceOptions> {}

// interface State {}

// export class ConfigEditor extends PureComponent<Props, State> {
//   onURLChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const { onOptionsChange, options } = this.props;
//     const jsonData = {
//       ...options.jsonData,
//       url: event.target.value,
//     };
//     onOptionsChange({ ...options, jsonData });
//   };

//   // onUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
//   //   const { onOptionsChange, options } = this.props;
//   //   const jsonData = {
//   //     ...options.jsonData,
//   //     username: event.target.value,
//   //   };
//   //   onOptionsChange({ ...options, jsonData });
//   // };

//   // onAPIKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
//   //   const { onOptionsChange, options } = this.props;
//   //   onOptionsChange({
//   //     ...options,
//   //     secureJsonData: {
//   //       apiKey: event.target.value,
//   //     },
//   //   });
//   // };

//   // onResetAPIKey = () => {
//   //   const { onOptionsChange, options } = this.props;
//   //   onOptionsChange({
//   //     ...options,
//   //     secureJsonFields: {
//   //       ...options.secureJsonFields,
//   //       apiKey: false,
//   //     },
//   //     secureJsonData: {
//   //       ...options.secureJsonData,
//   //       apiKey: '',
//   //     },
//   //   });
//   // };

//   render() {
//     const { options } = this.props;
//     const { jsonData } = options;
//     // const secureJsonData = (options.secureJsonData || {}) as DiscourseSecureJsonData;

//     return (
//       <div className="gf-form-group">
//         <div className="gf-form">
//           <FormField
//             label="URL"
//             labelWidth={6}
//             inputWidth={20}
//             onChange={this.onURLChange}
//             value={jsonData.url || ''}
//             placeholder="https://community.xxx.com/"
//           />
//         </div>

//         {/* <div className="gf-form">
//           <FormField
//             label="Username"
//             labelWidth={6}
//             inputWidth={20}
//             onChange={this.onUsernameChange}
//             value={jsonData.username || ''}
//             placeholder="Discourse username"
//           />
//         </div> */}

//         {/* <div className="gf-form-inline">
//           <div className="gf-form">
//             <SecretFormField
//               isConfigured={(secureJsonFields && secureJsonFields.apiKey) as boolean}
//               value={secureJsonData.apiKey || ''}
//               label="API Key"
//               placeholder="Discourse API key"
//               labelWidth={6}
//               inputWidth={20}
//               onReset={this.onResetAPIKey}
//               onChange={this.onAPIKeyChange}
//             />
//           </div>
//         </div> */}
//       </div>
//     );
//   }
// }