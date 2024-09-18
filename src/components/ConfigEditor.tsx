import { PureComponent} from 'react';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions } from '../types';
import {DataSourceHttpSettings} from "@grafana/ui";
import React from 'react';

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> {}
interface State {}
export class ConfigEditor extends PureComponent<Props, State> {
  render() {
    const { options } = this.props;
    return (
        <DataSourceHttpSettings
            defaultUrl="https://demo.akvorado.net/"
            dataSourceConfig={options}
            onChange={this.props.onOptionsChange}
        />
    );
  }
}