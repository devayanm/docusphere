import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlock from '@tiptap/extension-code-block';
import { useState } from 'react';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  CodeBracketIcon,
  ListBulletIcon,
  QueueListIcon,
  ChatBubbleLeftRightIcon,
  LinkIcon,
  PhotoIcon,
  TableCellsIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon
} from '@heroicons/react/24/outline';
import { Button } from './ui/button';
import { MonacoCodeBlock } from './MonacoCodeBlock';
import { cn } from '../lib/utils';

interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  content = '',
  onChange,
  placeholder = 'Start writing...',
  className
}: RichTextEditorProps) {
  const [showCodeBlock, setShowCodeBlock] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'monaco-code-block',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none max-w-none min-h-[200px] p-4',
        'data-placeholder': placeholder,
      },
    },
  });

  if (!editor) {
    return null;
  }

  const MenuButton = ({
    onClick,
    isActive = false,
    children,
    title,
    disabled = false
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
    disabled?: boolean;
  }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        "h-8 w-8 p-0 transition-all",
        isActive && "bg-primary text-primary-foreground",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </Button>
  );

  return (
    <div className={cn("border border-border rounded-lg bg-background overflow-hidden", className)}>
      {/* Enhanced Toolbar */}
      <div className="border-b border-border p-3 bg-muted/30">
        <div className="flex flex-wrap gap-2">
          {/* Undo/Redo */}
          <div className="flex gap-1">
            <MenuButton
              onClick={() => editor.chain().focus().undo().run()}
              isActive={false}
              title="Undo"
              disabled={!editor.can().undo()}
            >
              <ArrowUturnLeftIcon className="h-4 w-4" />
            </MenuButton>

            <MenuButton
              onClick={() => editor.chain().focus().redo().run()}
              isActive={false}
              title="Redo"
              disabled={!editor.can().redo()}
            >
              <ArrowUturnRightIcon className="h-4 w-4" />
            </MenuButton>
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Text formatting */}
          <div className="flex gap-1">
            <MenuButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold (Ctrl+B)"
            >
              <BoldIcon className="h-4 w-4" />
            </MenuButton>

            <MenuButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic (Ctrl+I)"
            >
              <ItalicIcon className="h-4 w-4" />
            </MenuButton>

            <MenuButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive('code')}
              title="Inline Code"
            >
              <CodeBracketIcon className="h-4 w-4" />
            </MenuButton>
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Headings */}
          <div className="flex gap-1">
            <MenuButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              title="Heading 1"
            >
              <span className="text-xs font-bold">H1</span>
            </MenuButton>

            <MenuButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              title="Heading 2"
            >
              <span className="text-xs font-bold">H2</span>
            </MenuButton>

            <MenuButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              title="Heading 3"
            >
              <span className="text-xs font-bold">H3</span>
            </MenuButton>
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Lists and quotes */}
          <div className="flex gap-1">
            <MenuButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <ListBulletIcon className="h-4 w-4" />
            </MenuButton>

            <MenuButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <QueueListIcon className="h-4 w-4" />
            </MenuButton>

            <MenuButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Blockquote"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4" />
            </MenuButton>
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Code block */}
          <MenuButton
            onClick={() => {
              editor.chain().focus().toggleCodeBlock({ language: 'javascript' }).run();
            }}
            isActive={editor.isActive('codeBlock')}
            title="Code Block"
          >
            <span className="text-xs font-mono">{'{}'}</span>
          </MenuButton>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <EditorContent
          editor={editor}
          className="prose prose-gray dark:prose-invert max-w-none"
        />
      </div>
    </div>
  );
}
