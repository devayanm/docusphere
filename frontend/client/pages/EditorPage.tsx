import { useState, useEffect } from 'react';
import { RichTextEditor } from '../components/RichTextEditor';
import { CommentsPanel } from '../components/CommentsPanel';
import { VersionHistory } from '../components/VersionHistory';
import { ImportExportModal } from '../components/ImportExportModal';
import { CollaborationIndicators } from '../components/CollaborationIndicators';
import { UserRoleManager } from '../components/UserRoleManager';
import { Button } from '../components/ui/button';
import {
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export default function EditorPage() {
  const [content, setContent] = useState(`
    <h1>Welcome to DocuSphere</h1>
    <p>Start creating your documentation here. This rich text editor supports:</p>
    <ul>
      <li><strong>Bold</strong> and <em>italic</em> text formatting</li>
      <li>Headers and lists</li>
      <li>Code blocks with syntax highlighting</li>
      <li>Blockquotes and more</li>
    </ul>
    <blockquote>
      <p>This is a sample blockquote to showcase the editor capabilities.</p>
    </blockquote>
    <pre><code class="language-javascript">// Sample code block
function hello() {
  console.log("Hello, DocuSphere!");
}</code></pre>
  `);

  const [title, setTitle] = useState('Untitled Document');
  const [showComments, setShowComments] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showUserManager, setShowUserManager] = useState(false);

  // Auto-save simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAutoSaving(true);
      setTimeout(() => {
        setLastSaved(new Date());
        setIsAutoSaving(false);
      }, 1000);
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleVersionRestore = (version: any) => {
    setContent(version.content);
    setTitle(version.title);
    setLastSaved(new Date());
  };

  const handleImport = (importedContent: string, importedTitle: string) => {
    setContent(importedContent);
    setTitle(importedTitle);
    setLastSaved(new Date());
  };

  return (
    <div className="relative">
      <div className={`transition-all duration-300 ${
        (showComments && showVersionHistory) || (showComments && showUserManager) || (showVersionHistory && showUserManager) ? 'mr-[672px]' :
        showComments || showVersionHistory || showUserManager ? 'mr-80' : ''
      }`}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-3xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-foreground placeholder-muted-foreground"
                placeholder="Document title..."
              />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImportModal(true)}
                >
                  <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExportModal(true)}
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant={showComments ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowComments(!showComments)}
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                  Comments
                </Button>
                <Button
                  variant={showVersionHistory ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowVersionHistory(!showVersionHistory)}
                >
                  <ClockIcon className="h-4 w-4 mr-2" />
                  History
                </Button>
                <Button
                  variant={showUserManager ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowUserManager(!showUserManager)}
                >
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  Users
                </Button>
                <Button size="sm">
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Publish
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Last edited: {lastSaved.toLocaleDateString()} •
              {isAutoSaving ? (
                <span className="text-yellow-600 dark:text-yellow-400"> Auto-saving...</span>
              ) : (
                <span className="text-green-600 dark:text-green-400"> Auto-saved</span>
              )}
            </div>
          </div>

          {/* Editor */}
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Start writing your documentation..."
            className="min-h-[600px]"
          />

          {/* Status bar with collaboration */}
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Words: {content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length}</span>
              <span>Version 1.0</span>
            </div>
            <CollaborationIndicators />
          </div>
        </div>
      </div>

      {/* Comments Panel */}
      <CommentsPanel
        pageId="editor-page"
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />

      {/* Version History Panel */}
      <div className={
        (showComments && showVersionHistory) || (showComments && showUserManager) || (showVersionHistory && showUserManager)
          ? 'mr-80'
          : ''
      }>
        <VersionHistory
          isOpen={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
          onRestore={handleVersionRestore}
          currentContent={content}
        />
      </div>

      {/* User Role Manager */}
      <div className={
        showComments && showUserManager ? 'mr-80' :
        showVersionHistory && showUserManager ? 'mr-80' : ''
      }>
        <UserRoleManager
          isOpen={showUserManager}
          onClose={() => setShowUserManager(false)}
        />
      </div>

      {/* Import/Export Modals */}
      <ImportExportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        mode="import"
        content={content}
        title={title}
        onImport={handleImport}
      />

      <ImportExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        mode="export"
        content={content}
        title={title}
      />
    </div>
  );
}
