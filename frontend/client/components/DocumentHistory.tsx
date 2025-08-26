import { useEffect, useState } from 'react';
import { 
  ClockIcon, 
  EyeIcon, 
  ArrowUturnLeftIcon, 
  XMarkIcon,
  ChevronLeftIcon,
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
  documentId: string;
  onRestore: (version: Version) => void;
  isOpen: boolean;
  onClose: () => void;
  versions?: Version[];
  isAutoSaving?: boolean;
  lastSaved?: Date;
}

const DocumentHistory: React.FC<DocumentHistoryProps> = ({ 
  documentId, 
  onRestore,
  isOpen,
  onClose,
  versions: externalVersions,
  isAutoSaving,
  lastSaved
}) => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'preview' | 'compare'>('list');
  const [previewVersion, setPreviewVersion] = useState<Version | null>(null);

  // Mock fallback data
  const mockVersions: Version[] = [
    {
      id: '5',
      version: 5,
      content: '<h1>Welcome to DocuSphere</h1><p>This is the latest version...</p>',
      createdBy: 'John Doe',
      createdAt: '2025-01-24T10:30:00Z',
      changesSummary: 'Added collaboration features and performance improvements',
      wordCount: 45
    },
    {
      id: '4',
      version: 4,
      content: '<h1>Welcome to DocuSphere</h1><p>This is the previous version...</p>',
      createdBy: 'Jane Smith',
      createdAt: '2025-01-23T15:45:00Z',
      changesSummary: 'UI improvements and performance optimizations',
      wordCount: 32
    }
  ];

  useEffect(() => {
    if (!isOpen) return;
    fetchVersions();
  }, [documentId, isOpen]);

  const fetchVersions = async () => {
    setLoading(true);
    setTimeout(() => {
      setVersions(externalVersions && externalVersions.length > 0 ? externalVersions : mockVersions);
      setLoading(false);
    }, 500);
  };

  const restoreVersion = async (version: Version) => {
    onRestore(version);
  };

  const handlePreview = (version: Version) => {
    setPreviewVersion(version);
    setViewMode('preview');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed right-0 top-0 h-full w-80 
                 bg-white dark:bg-gray-900    // ✅ supports dark mode
                 text-gray-900 dark:text-gray-100
                 border-l border-border shadow-lg z-50 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          {viewMode !== 'list' && (
            <button onClick={() => { setViewMode('list'); setPreviewVersion(null); }}>
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
          )}
          <ClockIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <h2 className="text-lg font-semibold">
            {viewMode === 'preview' ? `Version ${previewVersion?.version}` : 'Version History'}
          </h2>
        </div>
        <button onClick={onClose}>
          <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Status Info */}
      {(isAutoSaving || lastSaved) && (
        <div className="p-2 text-xs text-gray-600 dark:text-gray-400 border-b bg-gray-100 dark:bg-gray-800">
          {isAutoSaving ? "Auto-saving..." : `Last saved: ${lastSaved?.toLocaleString()}`}
        </div>
      )}

      {/* Version list */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
        ) : (
          versions.map((version, index) => (
            <div key={version.id} className="border rounded-lg p-3 mb-3 dark:border-gray-700">
              <div className="flex justify-between">
                <div>
                  <strong>Version {version.version}</strong>
                  <p className="text-xs">{formatDate(version.createdAt)} by {version.createdBy}</p>
                  {version.changesSummary && <p className="text-sm">{version.changesSummary}</p>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handlePreview(version)} title="Preview">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  {index !== 0 && (
                    <button onClick={() => restoreVersion(version)} title="Restore">
                      <ArrowUturnLeftIcon className="h-4 w-4 text-green-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentHistory;
