import { useState, useEffect } from 'react';
import { RichTextEditor } from '../components/RichTextEditor';
import { CommentsPanel } from '../components/CommentsPanel';
import DocumentHistory from '../components/DocumentHistory';
import { ImportExportModal } from '../components/ImportExportModal';
import { CollaborationIndicators } from '../components/CollaborationIndicators';
import { UserRoleManager } from '../components/UserRoleManager';
import useVersionManager from "../hooks/useVersionManager";
import { Button } from '../components/ui/button';
import {
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function EditorPage() {
  const [content, setContent] = useState(`<h1>Welcome to DocuSphere</h1><p>This is a simplified editor for testing.</p>`);
  const [title, setTitle] = useState('Simple Editor Test');
  const [showComments, setShowComments] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showUserManager, setShowUserManager] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Version management
  const {
    versions,
    isAutoSaving,
    lastSaved,
    saveVersion,
    restoreVersion
  } = useVersionManager({
    documentId: 'doc-1',
    currentContent: content,
    currentUser: 'John Doe',
    autoSaveInterval: 30000 // 30 seconds
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHasUnsavedChanges(true);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [content, title]);

  useEffect(() => {
    if (!isAutoSaving) {
      setHasUnsavedChanges(false);
    }
  }, [isAutoSaving]);

  const handleVersionRestore = async (version: any) => {
    try {
      await restoreVersion(version.id);
      setContent(version.content);
      setTitle(`Restored: Version ${version.version}`);
      setShowVersionHistory(false);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error restoring version:', error);
    }
  };

  const handleManualSave = async () => {
    try {
      const summary = prompt('Enter a summary for this version (optional):');
      await saveVersion(summary || 'Manual save');
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving version:', error);
    }
  };

  const handleImport = (importedContent: string, importedTitle: string) => {
    setContent(importedContent);
    setTitle(importedTitle);
    setHasUnsavedChanges(true);
  };

  const getStatusIcon = () => {
    if (isAutoSaving) {
      return <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-500 border-t-transparent" />;
    }
    if (hasUnsavedChanges) {
      return <ExclamationCircleIcon className="h-4 w-4 text-yellow-500" />;
    }
    return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (isAutoSaving) return 'Auto-saving...';
    if (hasUnsavedChanges) return 'Unsaved changes';
    return 'All changes saved';
  };

  const getStatusColor = () => {
    if (isAutoSaving) return 'text-yellow-600 dark:text-yellow-400';
    if (hasUnsavedChanges) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className="relative">
      {/* Main Content Wrapper (shifts when side panels open) */}
      <div 
        className={`transition-all duration-300 ${
          showComments || showVersionHistory || showUserManager ? 'mr-80' : ''
        }`}
      >
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
                  onClick={handleManualSave}
                  disabled={isAutoSaving}
                >
                  {isAutoSaving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                  ) : (
                    <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)}>
                  <DocumentArrowUpIcon className="h-4 w-4 mr-2" />Import
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowExportModal(true)}>
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />Export
                </Button>
                <Button variant="outline" size="sm"><EyeIcon className="h-4 w-4 mr-2" />Preview</Button>
                <Button variant={showComments ? "default" : "outline"} size="sm" onClick={() => setShowComments(!showComments)}>
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />Comments
                </Button>
                <Button variant={showVersionHistory ? "default" : "outline"} size="sm" onClick={() => setShowVersionHistory(!showVersionHistory)}>
                  <ClockIcon className="h-4 w-4 mr-2" />History ({versions.length})
                </Button>
                <Button variant={showUserManager ? "default" : "outline"} size="sm" onClick={() => setShowUserManager(!showUserManager)}>
                  <UserGroupIcon className="h-4 w-4 mr-2" />Users
                </Button>
                <Button size="sm"><ShareIcon className="h-4 w-4 mr-2" />Publish</Button>
              </div>
            </div>
            
            {/* Enhanced Status Bar */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>Words: {content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length}</span>
                <span>Version {versions.length > 0 ? versions[0]?.version || 1 : 1}</span>
                <span>Last edited: {lastSaved.toLocaleDateString()}</span>
              </div>
              
              <div className={`flex items-center gap-2 ${getStatusColor()}`}>
                {getStatusIcon()}
                <span>{getStatusText()}</span>
                {!isAutoSaving && hasUnsavedChanges && (
                  <button 
                    onClick={handleManualSave}
                    className="ml-2 text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                  >
                    Save now
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="border border-border rounded-lg">
            <RichTextEditor 
              content={content} 
              onChange={setContent} 
              placeholder="Start writing..." 
              className="min-h-[600px]" 
            />
          </div>

          {/* Bottom Status */}
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Characters: {content.length}</span>
              <span>Reading time: ~{Math.ceil(content.replace(/<[^>]*>/g, '').split(' ').length / 200)} min</span>
            </div>
            <CollaborationIndicators />
          </div>
        </div>
      </div>

      {/* Panels */}
      <CommentsPanel 
        pageId="editor-page" 
        isOpen={showComments} 
        onClose={() => setShowComments(false)} 
      />

      {showVersionHistory && (
        <DocumentHistory 
          documentId="doc-1" 
          isOpen={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
          onRestore={handleVersionRestore}
        />
      )}

      {showUserManager && (
        <UserRoleManager 
          isOpen={showUserManager} 
          onClose={() => setShowUserManager(false)} 
        />
      )}

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
