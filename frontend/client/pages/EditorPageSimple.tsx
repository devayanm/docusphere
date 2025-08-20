import { useState } from 'react';
import { RichTextEditor } from '../components/RichTextEditor';

export default function EditorPageSimple() {
  const [content, setContent] = useState(`
    <h1>Welcome to DocuSphere</h1>
    <p>This is a simplified editor for testing.</p>
  `);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Simple Editor Test</h1>
      <RichTextEditor
        content={content}
        onChange={setContent}
        placeholder="Start writing..."
        className="min-h-[400px]"
      />
    </div>
  );
}
