import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { 
  ClipboardIcon, 
  CheckIcon, 
  ChevronUpIcon, 
  ChevronDownIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { cn } from '../lib/utils';

interface MonacoCodeBlockProps {
  language?: string;
  code: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
  onDelete?: () => void;
  className?: string;
}

const languages = [
  'javascript',
  'typescript',
  'python',
  'java',
  'csharp',
  'cpp',
  'c',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'dart',
  'html',
  'css',
  'scss',
  'less',
  'json',
  'xml',
  'yaml',
  'toml',
  'markdown',
  'bash',
  'powershell',
  'sql',
  'dockerfile',
  'nginx',
  'apache',
];

export function MonacoCodeBlock({
  language = 'javascript',
  code,
  onChange,
  readOnly = false,
  onDelete,
  className
}: MonacoCodeBlockProps) {
  const { theme } = useTheme();
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
    setIsLanguageOpen(false);
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.layout();
    }
  }, [isCollapsed]);

  return (
    <div className={cn("border border-border rounded-lg bg-background overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center gap-1 px-2 py-1 text-xs font-mono bg-background border border-border rounded hover:bg-accent transition-colors"
            >
              {currentLanguage}
              <ChevronDownIcon className="h-3 w-3" />
            </button>
            
            {isLanguageOpen && (
              <div className="absolute top-full left-0 mt-1 z-20 bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className="block w-full px-3 py-2 text-left text-xs font-mono hover:bg-accent transition-colors"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <span className="text-xs text-muted-foreground">
            {readOnly ? 'Read-only' : 'Editable'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Copy button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-7 w-7 p-0"
          >
            {copied ? (
              <CheckIcon className="h-3 w-3 text-green-500" />
            ) : (
              <ClipboardIcon className="h-3 w-3" />
            )}
          </Button>

          {/* Collapse button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-7 w-7 p-0"
          >
            {isCollapsed ? (
              <ChevronDownIcon className="h-3 w-3" />
            ) : (
              <ChevronUpIcon className="h-3 w-3" />
            )}
          </Button>

          {/* Delete button */}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            >
              <XMarkIcon className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Editor */}
      {!isCollapsed && (
        <div className="relative">
          <Editor
            height="200px"
            language={currentLanguage}
            value={code}
            onChange={(value) => onChange?.(value || '')}
            onMount={handleEditorDidMount}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              readOnly,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              lineNumbers: 'on',
              glyphMargin: false,
              folding: true,
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 3,
              renderLineHighlight: 'none',
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
              },
              fontSize: 14,
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            }}
          />
        </div>
      )}

      {/* Collapsed preview */}
      {isCollapsed && (
        <div className="px-4 py-2 bg-muted/10">
          <pre className="text-xs text-muted-foreground font-mono truncate">
            {code.split('\n')[0] || 'Empty code block'}
            {code.split('\n').length > 1 && '...'}
          </pre>
        </div>
      )}
    </div>
  );
}
