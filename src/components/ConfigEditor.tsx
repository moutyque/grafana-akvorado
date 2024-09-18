import React, { ChangeEvent } from 'react';
import { InlineField, Input } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions } from '../types';

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> {}

export function ConfigEditor(props: Props) {
  const { onOptionsChange, options } = props;
  const { jsonData } = options;

  const onUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        url: event.target.value,
      },
    });
  };

  return (
    <>
      <InlineField label="Url" labelWidth={14} interactive tooltip={'Json field returned to frontend'}>
        <Input
          id="config-editor-url"
          onChange={onUrlChange}
          value={jsonData.url}
          placeholder="Enter the akvorado console URL, e.g. https://akvorado.tools/"
          width={40}
        />
      </InlineField>
    </>
  );
}
