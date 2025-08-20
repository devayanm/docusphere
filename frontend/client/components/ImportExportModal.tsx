import { useState, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  XMarkIcon,
  ClipboardDocumentIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'import' | 'export';
  content: string;
  title: string;
  onImport?: (content: string, title: string) => void;
}

export function ImportExportModal({ 
  isOpen, 
  onClose, 
  mode, 
  content, 
  title,
  onImport 
}: ImportExportModalProps) {
  const [format, setFormat] = useState<'markdown' | 'json'>('markdown');
  const [importContent, setImportContent] = useState('');
  const [importTitle, setImportTitle] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const htmlToMarkdown = (html: string): string => {
    // Simple HTML to Markdown conversion - in a real app, use a proper library like turndown
    let markdown = html
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
      .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
      .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
      .replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
        return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
      })
      .replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
        let counter = 1;
        return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`) + '\n';
      })
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Normalize line breaks
      .trim();

    return markdown;
  };

  const markdownToHtml = (markdown: string): string => {
    // Simple Markdown to HTML conversion - in a real app, use a proper library like marked
    let html = markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/^\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^\`(.*)\`/gim, '<code>$1</code>')
      .replace(/^> (.*)$/gim, '<blockquote>$1</blockquote>')
      .replace(/^\- (.*)$/gim, '<li>$1</li>')
      .replace(/^[0-9]+\. (.*)$/gim, '<li>$1</li>')
      .replace(/^\n$/gim, '<br>');

    return html;
  };

  const getExportContent = () => {
    if (format === 'markdown') {
      return htmlToMarkdown(content);
    } else {
      return JSON.stringify({
        title,
        content,
        format: 'html',
        exportDate: new Date().toISOString(),
        metadata: {
          wordCount: content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length,
          version: '1.0'
        }
      }, null, 2);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getExportContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const exportContent = getExportContent();
    const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.${format === 'markdown' ? 'md' : 'json'}`;
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      if (file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          setImportContent(parsed.content || content);
          setImportTitle(parsed.title || file.name.replace('.json', ''));
          setFormat('json');
        } catch (err) {
          setImportContent(content);
          setImportTitle(file.name.replace('.json', ''));
        }
      } else {
        setImportContent(markdownToHtml(content));
        setImportTitle(file.name.replace(/\.(md|txt)$/, ''));
        setFormat('markdown');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (importContent.trim() && onImport) {
      onImport(importContent, importTitle || 'Imported Document');
      onClose();
      setImportContent('');
      setImportTitle('');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-background border border-border shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    {mode === 'import' ? (
                      <DocumentArrowUpIcon className="h-5 w-5 text-primary" />
                    ) : (
                      <DocumentArrowDownIcon className="h-5 w-5 text-primary" />
                    )}
                    <Dialog.Title className="text-lg font-semibold text-foreground">
                      {mode === 'import' ? 'Import Document' : 'Export Document'}
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-accent rounded transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="p-6">
                  {/* Format Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Format
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFormat('markdown')}
                        className={cn(
                          "flex-1 p-3 rounded-lg border transition-colors text-left",
                          format === 'markdown'
                            ? "border-primary bg-primary/5 text-foreground"
                            : "border-border hover:bg-accent text-muted-foreground"
                        )}
                      >
                        <div className="font-medium">Markdown</div>
                        <div className="text-xs mt-1">
                          Plain text format with formatting syntax
                        </div>
                      </button>
                      <button
                        onClick={() => setFormat('json')}
                        className={cn(
                          "flex-1 p-3 rounded-lg border transition-colors text-left",
                          format === 'json'
                            ? "border-primary bg-primary/5 text-foreground"
                            : "border-border hover:bg-accent text-muted-foreground"
                        )}
                      >
                        <div className="font-medium">JSON</div>
                        <div className="text-xs mt-1">
                          Structured format with metadata
                        </div>
                      </button>
                    </div>
                  </div>

                  {mode === 'export' ? (
                    <>
                      {/* Export Preview */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-foreground mb-3">
                          Preview
                        </label>
                        <div className="bg-muted/30 rounded-lg p-4 border border-border">
                          <pre className="text-sm text-foreground whitespace-pre-wrap max-h-40 overflow-y-auto font-mono">
                            {getExportContent()}
                          </pre>
                        </div>
                      </div>

                      {/* Export Actions */}
                      <div className="flex gap-3">
                        <Button
                          onClick={handleCopy}
                          variant="outline"
                          className="flex-1"
                        >
                          {copied ? (
                            <CheckIcon className="h-4 w-4 mr-2 text-green-500" />
                          ) : (
                            <ClipboardDocumentIcon className="h-4 w-4 mr-2" />
                          )}
                          {copied ? 'Copied!' : 'Copy to Clipboard'}
                        </Button>
                        <Button
                          onClick={handleDownload}
                          className="flex-1"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                          Download File
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Import Options */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-foreground mb-3">
                          Import Method
                        </label>
                        <div className="space-y-3">
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full"
                          >
                            <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                            Choose File (.md, .json, .txt)
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".md,.json,.txt"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </div>
                      </div>

                      {/* Import Content */}
                      {importContent && (
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-foreground mb-3">
                            Document Title
                          </label>
                          <input
                            type="text"
                            value={importTitle}
                            onChange={(e) => setImportTitle(e.target.value)}
                            className="w-full p-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter document title..."
                          />
                          
                          <label className="block text-sm font-medium text-foreground mb-3 mt-4">
                            Content Preview
                          </label>
                          <div className="bg-muted/30 rounded-lg p-4 border border-border">
                            <div 
                              className="prose prose-sm max-w-none max-h-40 overflow-y-auto"
                              dangerouslySetInnerHTML={{ __html: importContent.substring(0, 500) + '...' }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Import Actions */}
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={onClose}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleImport}
                          disabled={!importContent.trim()}
                          className="flex-1"
                        >
                          <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                          Import Document
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
