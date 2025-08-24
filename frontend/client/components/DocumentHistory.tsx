import { useEffect, useState } from 'react';
import { 
  ClockIcon, 
  EyeIcon, 
  ArrowUturnLeftIcon, 
  XMarkIcon,
  ChevronLeftIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';

interface Version {
  id: string;
  version: number;
  content: string;
  createdBy: string;
  createdAt: string;
  changesSummary?: string;
  wordCount?: number;
}

interface DocumentHistoryProps {
  documentId?: string;
  onRestore?: (version: Version) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const DocumentHistory: React.FC<DocumentHistoryProps> = ({ 
  documentId = '1', 
  onRestore,
  isOpen = true,
  onClose 
}) => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersions, setSelectedVersions] = useState<{ from: Version | null, to: Version | null }>({ from: null, to: null });
  const [showCompare, setShowCompare] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'preview' | 'compare'>('list');
  const [previewVersion, setPreviewVersion] = useState<Version | null>(null);

  // Mock data - replace with your actual API call
  const mockVersions: Version[] = [
    {
      id: '5',
      version: 5,
      content: '<h1>Welcome to DocuSphere</h1><p>This is the latest version with enhanced features and improved collaboration tools. We have added real-time editing capabilities.</p><p>Recent updates include:</p><ul><li>Better performance</li><li>Enhanced UI</li><li>Real-time collaboration</li></ul>',
      createdBy: 'John Doe',
      createdAt: '2025-01-24T10:30:00Z',
      changesSummary: 'Added collaboration features and performance improvements',
      wordCount: 45
    },
    {
      id: '4',
      version: 4,
      content: '<h1>Welcome to DocuSphere</h1><p>This is the latest version with enhanced features and improved collaboration tools.</p><p>Recent updates include:</p><ul><li>Better performance</li><li>Enhanced UI</li></ul>',
      createdBy: 'Jane Smith',
      createdAt: '2025-01-23T15:45:00Z',
      changesSummary: 'UI improvements and performance optimizations',
      wordCount: 32
    },
    {
      id: '3',
      version: 3,
      content: '<h1>Welcome to DocuSphere</h1><p>This is an updated version with some new features and bug fixes.</p><p>New features:</p><ul><li>Better performance</li></ul>',
      createdBy: 'Alice Johnson',
      createdAt: '2025-01-22T09:20:00Z',
      changesSummary: 'Added new features and bug fixes',
      wordCount: 28
    },
    {
      id: '2',
      version: 2,
      content: '<h1>Welcome to DocuSphere</h1><p>This is an updated version with some improvements.</p>',
      createdBy: 'Bob Wilson',
      createdAt: '2025-01-21T14:15:00Z',
      changesSummary: 'Minor improvements and content updates',
      wordCount: 18
    },
    {
      id: '1',
      version: 1,
      content: '<h1>Welcome to DocuSphere</h1><p>This is the initial version of our document.</p>',
      createdBy: 'John Doe',
      createdAt: '2025-01-20T11:00:00Z',
      changesSummary: 'Initial document creation',
      wordCount: 15
    }
  ];

  useEffect(() => {
    if (!isOpen) return;
    fetchVersions();
  }, [documentId, isOpen]);

  const fetchVersions = async () => {
    try {
      // Replace with your actual API call
      // const response = await fetch(`/api/documents/${documentId}/history`);
      // if (response.ok) {
      //   const data = await response.json();
      //   setVersions(data);
      // }
      
      // Using mock data for demonstration
      setTimeout(() => {
        setVersions(mockVersions);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching versions:', error);
      setLoading(false);
    }
  };

  const restoreVersion = async (version: Version) => {
    try {
      // const response = await fetch(`/api/documents/${documentId}/restore/${version.id}`, {
      //   method: 'POST'
      // });
      
      // if (response.ok) {
      if (onRestore) {
        onRestore(version);
      }
      // }
    } catch (error) {
      console.error('Error restoring version:', error);
    }
  };

  const handleCompare = (version: Version) => {
    if (!selectedVersions.from) {
      setSelectedVersions({ from: version, to: null });
    } else if (!selectedVersions.to && selectedVersions.from.id !== version.id) {
      setSelectedVersions({ ...selectedVersions, to: version });
      setViewMode('compare');
    } else {
      setSelectedVersions({ from: version, to: null });
      setViewMode('list');
    }
  };

  const handlePreview = (version: Version) => {
    setPreviewVersion(version);
    setViewMode('preview');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  };

  const createDiff = (oldText: string, newText: string) => {
    const oldWords = stripHtml(oldText).split(' ');
    const newWords = stripHtml(newText).split(' ');
    const diff = [];
    let i = 0, j = 0;
    
    while (i < oldWords.length || j < newWords.length) {
      if (i >= oldWords.length) {
        diff.push({ type: 'added', text: newWords[j] });
        j++;
      } else if (j >= newWords.length) {
        diff.push({ type: 'removed', text: oldWords[i] });
        i++;
      } else if (oldWords[i] === newWords[j]) {
        diff.push({ type: 'unchanged', text: oldWords[i] });
        i++; j++;
      } else {
        // Simple diff - can be enhanced with better algorithms
        diff.push({ type: 'removed', text: oldWords[i] });
        diff.push({ type: 'added', text: newWords[j] });
        i++; j++;
      }
    }
    return diff;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-l border-gray-300 dark:border-gray-700 shadow-lg z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {viewMode !== 'list' && (
              <button 
                onClick={() => {
                  setViewMode('list');
                  setPreviewVersion(null);
                  setSelectedVersions({ from: null, to: null });
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
            )}
            <ClockIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {viewMode === 'compare' ? 'Compare Versions' : 
               viewMode === 'preview' ? `Version ${previewVersion?.version}` : 
               'Version History'}
            </h2>
          </div>
          {onClose && (
            <button 
              onClick={onClose} 
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === 'list' && (
          <div className="p-4">
            {/* Selection info */}
            {selectedVersions.from && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {selectedVersions.to ? 
                    `Comparing v${selectedVersions.from.version} with v${selectedVersions.to.version}` :
                    `Selected v${selectedVersions.from.version}. Select another to compare.`
                  }
                </p>
                <button 
                  onClick={() => {
                    setSelectedVersions({ from: null, to: null });
                  }}
                  className="text-blue-600 dark:text-blue-400 text-sm underline hover:no-underline"
                >
                  Clear selection
                </button>
              </div>
            )}

            {/* Version list */}
            <div className="space-y-3">
              {loading ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <ClockIcon className="h-8 w-8 mx-auto mb-2 animate-spin" />
                  Loading versions...
                </div>
              ) : (
                versions.map((version, index) => (
                  <div 
                    key={version.id} 
                    className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                      selectedVersions.from?.id === version.id || selectedVersions.to?.id === version.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            Version {version.version}
                          </span>
                          {index === 0 && (
                            <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <UserIcon className="h-4 w-4" />
                          <span>{version.createdBy}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{formatDate(version.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handlePreview(version)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleCompare(version)}
                          className={`p-2 rounded-lg transition-colors ${
                            selectedVersions.from?.id === version.id 
                              ? 'bg-blue-500 text-white' 
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          title="Compare"
                        >
                          <ArrowsRightLeftIcon className="h-4 w-4" />
                        </button>
                        {index !== 0 && (
                          <button 
                            onClick={() => restoreVersion(version)}
                            className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Restore"
                          >
                            <ArrowUturnLeftIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {version.changesSummary && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {version.changesSummary}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      <div className="flex items-center gap-1">
                        <DocumentTextIcon className="h-3 w-3" />
                        <span>{version.wordCount || stripHtml(version.content).split(' ').length} words</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {viewMode === 'preview' && previewVersion && (
          <div className="p-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <UserIcon className="h-4 w-4" />
                <span>By {previewVersion.createdBy}</span>
                <span>•</span>
                <span>{formatDate(previewVersion.createdAt)}</span>
              </div>
              {previewVersion.changesSummary && (
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {previewVersion.changesSummary}
                </p>
              )}
            </div>
            <div 
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: previewVersion.content }}
            />
          </div>
        )}

        {viewMode === 'compare' && selectedVersions.from && selectedVersions.to && (
          <div className="p-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Comparing Version {selectedVersions.from.version} ({formatDate(selectedVersions.from.createdAt)}) 
                with Version {selectedVersions.to.version} ({formatDate(selectedVersions.to.createdAt)})
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-medium mb-3 text-gray-900 dark:text-white">Changes:</h4>
              <div className="text-sm leading-relaxed">
                {createDiff(selectedVersions.from.content, selectedVersions.to.content).map((item, index) => (
                  <span
                    key={index}
                    className={
                      item.type === 'added' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-1 rounded' :
                      item.type === 'removed' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 line-through px-1 rounded' : 
                      'text-gray-700 dark:text-gray-300'
                    }
                  >
                    {item.text}
                    {index < createDiff(selectedVersions.from.content, selectedVersions.to.content).length - 1 ? ' ' : ''}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentHistory;