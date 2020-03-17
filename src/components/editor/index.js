import React, {useState} from 'react';
import MonacoEditor from 'react-monaco-editor'
import * as monaco from 'monaco-editor'

// import { Container } from './styles';


const jsonCode = `
  {
      "p1": "v3",
      "p2": false
  }
`

export default function Editor() {

  const startPartLines=[1, 2];
  const endPartLines=[5,6]

  const [code, setCode] = useState(jsonCode)
  const [monacoEditor, setEditor]= useState() 

  const onChange = (newValue, event)  =>{
    const changes = event.changes;
    
    // Not allowing changes to specific lines
    changes.forEach(change => {
      if(!event.isUndoing && ((change.range.startLineNumber >= startPartLines[0] && change.range.endLineNumber <= startPartLines[1]) || change.range.startLineNumber >= endPartLines[0] && change.range.endLineNumber <= endPartLines[1]) ){
        console.log('proibido editar')
        monacoEditor.trigger('whatever...', 'undo')
      }
    })
  }

  const editorDidMount = (editor, monaco)  =>{
    setEditor(editor)

    editor.setPosition({lineNumber:startPartLines[1]+1, column:1});
    editor.focus(); 
    
    // configure the JSON language support with schemas and schema associations
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      enableSchemaRequest: true,
      validate: true,
      allowComments: true,
      schemas: [{
          uri: "http://myserver/foo-schema.json", // id of the first schema
          fileMatch: ['*'], // associate with our model
          schema: {
              type: "object",
              properties: {
                  p1: {
                      enum: ["v1", "v2"]
                  },
                  p2: {
                      $ref: "http://myserver/bar-schema.json" // reference the second schema
                  }
              }
          }
      }, {
          uri: "http://myserver/bar-schema.json", // id of the first schema
          schema: {
              type: "object",
              properties: {
                  q1: {
                      enum: ["x1", "x2"]
                  }
              }
          }
      }]
    });
  }

  const options = {
    selectOnLineNumbers: true,
  };

  return (
    <MonacoEditor
        width="600"
        height="800"
        language="json"
        theme="vs-dark"
        defaultValue=''
        value={code}
        onChange={onChange}
        options={options}
        editorDidMount={editorDidMount}
    />
  );
}
