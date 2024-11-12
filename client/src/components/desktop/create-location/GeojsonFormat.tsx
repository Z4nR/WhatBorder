import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { Typography } from 'antd';
import { GeoFormatProps } from '@/utils/types/map.types';

const { Text } = Typography;

const GeojsonFormat: React.FC<GeoFormatProps> = ({ initialJson }) => {
  const initialJsonString = JSON.stringify(initialJson, null, 2);

  const [jsonString, setJsonString] = useState(initialJsonString);

  useEffect(() => {
    setJsonString(initialJsonString);
  }, [initialJsonString]);

  return (
    <>
      <Text>Format Data Yang Nantinya Akan Disimpan</Text>
      <CodeMirror
        value={jsonString}
        theme={'dark'}
        height="60vh"
        editable={false}
        basicSetup
        autoFocus
        extensions={[json(), linter(jsonParseLinter())]}
      />
    </>
  );
};

export default GeojsonFormat;
