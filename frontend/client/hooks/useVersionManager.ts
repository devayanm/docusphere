import { useState, useCallback, useEffect } from 'react';

interface Version {
  id: string;
  version: number;
  content: string;
  createdBy: string;
  createdAt: string;
  changesSummary?: string;
  wordCount?: number;
}

interface UseVersionManagerProps {
  documentId: string;
  currentContent: string;
  currentUser: string;
  autoSaveInterval?: number; // in milliseconds
}

const useVersionManager = ({
  documentId,
  currentContent,
  currentUser,
  autoSaveInterval = 30000 // 30 seconds default
}: UseVersionManagerProps) => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  // Create a new version
  const createVersion = useCallback(async (content: string, changesSummary?: string) => {
    try {
      const wordCount = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;

      const newVersion: Version = {
        id: Date.now().toString(), // In production, use UUID
        version: Date.now(), // Use timestamp to ensure unique version numbers
        content,
        createdBy: currentUser,
        createdAt: new Date().toISOString(),
        changesSummary,
        wordCount
      };

      setVersions(prev => [newVersion, ...prev]);
      setLastSaved(new Date());
      return newVersion;
    } catch (error) {
      console.error('Error creating version:', error);
      throw error;
    }
  }, [currentUser]);

  // Auto-save functionality
  useEffect(() => {
    if (!currentContent || !autoSaveInterval) return;

    let timeoutId: NodeJS.Timeout;
    const interval = setInterval(async () => {
      setIsAutoSaving(true);
      try {
        await createVersion(currentContent, 'Auto-saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        timeoutId = setTimeout(() => setIsAutoSaving(false), 1000);
      }
    }, autoSaveInterval);

    return () => {
      clearInterval(interval);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [currentContent, autoSaveInterval, createVersion]);

  // Manual save
  const saveVersion = useCallback(async (changesSummary?: string) => {
    setIsAutoSaving(true);
    let timeoutId: NodeJS.Timeout;
    try {
      const version = await createVersion(currentContent, changesSummary);
      return version;
    } finally {
      timeoutId = setTimeout(() => setIsAutoSaving(false), 500);
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [currentContent, createVersion]);

  // Restore version
  const restoreVersion = useCallback(async (versionId: string) => {
    try {
      const version = versions.find(v => v.id === versionId);
      if (version) {
        await createVersion(version.content, `Restored from Version ${version.version}`);
        return version;
      }
      throw new Error('Version not found');
    } catch (error) {
      console.error('Error restoring version:', error);
      throw error;
    }
  }, [versions, createVersion]);

  // Load versions (dummy for now)
  const loadVersions = useCallback(async () => {
    try {
      setVersions([]); // Replace with API call later
    } catch (error) {
      console.error('Error loading versions:', error);
    }
  }, []);

  useEffect(() => {
    loadVersions();
  }, [loadVersions]);

  return {
    versions,
    isAutoSaving,
    lastSaved,
    createVersion,
    saveVersion,
    restoreVersion,
    loadVersions
  };
};

export default useVersionManager;
