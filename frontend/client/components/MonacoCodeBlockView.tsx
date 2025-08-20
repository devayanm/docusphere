import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { MonacoCodeBlock } from './MonacoCodeBlock';
import { useState } from 'react';

export function MonacoCodeBlockView({ node, updateAttributes, deleteNode, editor }: any) {
  const [code, setCode] = useState(node.textContent || '');
  const language = node.attrs.language || 'javascript';

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    // Update the node content
    const { from, to } = editor.state.selection;
    const tr = editor.state.tr.insertText(newCode, from, to);
    editor.view.dispatch(tr);
  };

  const handleLanguageChange = (newLanguage: string) => {
    updateAttributes({ language: newLanguage });
  };

  const handleDelete = () => {
    deleteNode();
  };

  return (
    <NodeViewWrapper className="my-4">
      <MonacoCodeBlock
        language={language}
        code={code}
        onChange={handleCodeChange}
        onDelete={handleDelete}
        readOnly={false}
      />
      <NodeViewContent style={{ display: 'none' }} />
    </NodeViewWrapper>
  );
}
