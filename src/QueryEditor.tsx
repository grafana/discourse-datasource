import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DiscourseDataSource } from './DataSource';
import { defaultQuery, DiscourseDataSourceOptions, MyQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<DiscourseDataSource, MyQuery, DiscourseDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, reportName: event.target.value });
  };

  onConstantChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, type: event.target.value });
    // executes the query
    onRunQuery();
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { type, reportName } = query;

    return (
      <div className="gf-form">
        <FormField width={4} value={type} onChange={this.onConstantChange} label="Type" type="string" step="0.1" />
        <FormField
          labelWidth={8}
          value={reportName || ''}
          onChange={this.onQueryTextChange}
          label="Report"
          tooltip="Not used yet"
        />
      </div>
    );
  }
}
