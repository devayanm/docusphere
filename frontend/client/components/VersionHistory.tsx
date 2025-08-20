import { useState } from 'react';
import { 
  ClockIcon, 
  ArrowUturnLeftIcon, 
  XMarkIcon,
  UserCircleIcon,
  EyeIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface Version {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  changesSummary: string;
  isCurrent?: boolean;
  wordCount: number;
}

interface VersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (version: Version) => void;
  currentContent: string;
}

// Mock version history data
const mockVersions: Version[] = [
  {
    id: 'v1',
    title: 'Untitled Document',
    content: '<h1>Welcome to DocuSphere</h1><p>Latest version with all updates...</p>',
    author: 'You',
    timestamp: '2024-01-15T14:30:00Z',
    changesSummary: 'Added new features section and code examples',
    isCurrent: true,
    wordCount: 485
  },
  {
    id: 'v2',
    title: 'Untitled Document',
    content: '<h1>Welcome to DocuSphere</h1><p>Previous version content...</p>',
    author: 'Sarah Chen',
    timestamp: '2024-01-15T12:15:00Z',
    changesSummary: 'Updated formatting and fixed typos',
    wordCount: 432
  },
  {
    id: 'v3',
    title: 'Getting Started Guide',
    content: '<h1>Getting Started</h1><p>Earlier version...</p>',
    author: 'Mike Johnson',
    timestamp: '2024-01-15T10:00:00Z',
    changesSummary: 'Initial draft with basic structure',
    wordCount: 315
  },
  {
    id: 'v4',
    title: 'Draft Document',
    content: '<h1>Draft</h1><p>Very early draft...</p>',
    author: 'You',
    timestamp: '2024-01-14T16:45:00Z',
    changesSummary: 'Created document',
    wordCount: 125
  }
];

export function VersionHistory({ isOpen, onClose, onRestore, currentContent }: VersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleRestore = (version: Version) => {
    if (version.isCurrent) return;
    
    if (confirm(`Are you sure you want to restore to "${version.title}" from ${formatDate(version.timestamp)}? This will create a new version with the restored content.`)) {
      onRestore(version);
      onClose();
    }
  };

  const getChangeIndicator = (current: number, previous: number) => {
    const diff = current - previous;
    if (diff > 0) return { text: `+${diff}`, color: 'text-green-600 dark:text-green-400' };
    if (diff < 0) return { text: `${diff}`, color: 'text-red-600 dark:text-red-400' };
    return { text: '0', color: 'text-muted-foreground' };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-background border-l border-border shadow-lg z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Version History</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-accent rounded transition-colors"
        >
          <XMarkIcon className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Auto-save status */}
      <div className="p-4 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2 text-sm">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-foreground">Auto-save enabled</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Changes are automatically saved every 30 seconds
        </p>
      </div>

      {/* Version List */}
      <div className="flex-1 overflow-y-auto">
        {mockVersions.map((version, index) => {
          const previousVersion = mockVersions[index + 1];
          const changeIndicator = previousVersion 
            ? getChangeIndicator(version.wordCount, previousVersion.wordCount)
            : null;

          return (
            <div
              key={version.id}
              className={cn(
                "p-4 border-b border-border hover:bg-accent/50 transition-colors cursor-pointer",
                version.isCurrent && "bg-primary/5 border-l-2 border-l-primary"
              )}
              onClick={() => setSelectedVersion(selectedVersion?.id === version.id ? null : version)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-foreground truncate">
                      {version.title}
                    </span>
                    {version.isCurrent && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-primary text-primary-foreground">
                        Current
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <UserCircleIcon className="h-3 w-3" />
                    <span>{version.author}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(version.timestamp)}</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {version.changesSummary}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 ml-2">
                  <span className="text-xs text-muted-foreground">
                    {version.wordCount} words
                  </span>
                  {changeIndicator && (
                    <span className={cn("text-xs font-medium", changeIndicator.color)}>
                      {changeIndicator.text}
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded actions */}
              {selectedVersion?.id === version.id && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPreview(true);
                      }}
                      className="flex-1"
                    >
                      <EyeIcon className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    
                    {!version.isCurrent && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestore(version);
                        }}
                        className="flex-1"
                      >
                        <ArrowUturnLeftIcon className="h-3 w-3 mr-1" />
                        Restore
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(version.content);
                      }}
                      className="flex-1"
                    >
                      <DocumentDuplicateIcon className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  
                  <div className="mt-2 text-xs text-muted-foreground">
                    <strong>Created:</strong> {formatDate(version.timestamp)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="text-xs text-muted-foreground text-center">
          <p>Versions are kept for 30 days</p>
          <p className="mt-1">Premium users get unlimited history</p>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedVersion && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold">
                Preview: {selectedVersion.title} ({formatDate(selectedVersion.timestamp)})
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1 hover:bg-accent rounded"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedVersion.content }}
              />
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-border">
              {!selectedVersion.isCurrent && (
                <Button
                  onClick={() => {
                    handleRestore(selectedVersion);
                    setShowPreview(false);
                  }}
                >
                  <ArrowUturnLeftIcon className="h-4 w-4 mr-2" />
                  Restore This Version
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
