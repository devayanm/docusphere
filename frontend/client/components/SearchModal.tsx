import { useState, useEffect, useRef, Fragment } from 'react';
import { Dialog, Transition, Combobox } from '@headlessui/react';
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon, 
  FolderIcon, 
  XMarkIcon,
  ClockIcon,
  HashtagIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { cn } from '../lib/utils';

interface SearchItem {
  id: string;
  title: string;
  content: string;
  path: string;
  type: 'page' | 'folder' | 'heading';
  lastModified?: string;
  author?: string;
  tags?: string[];
  excerpt?: string;
}

// Mock search data - in a real app, this would come from your backend
const searchData: SearchItem[] = [
  {
    id: '1',
    title: 'Getting Started with DocuSphere',
    content: 'Welcome to DocuSphere, the modern GitBook alternative. This guide will help you get started with creating and managing your documentation.',
    path: '/docs/getting-started',
    type: 'page',
    lastModified: '2024-01-15',
    author: 'Team DocuSphere',
    tags: ['guide', 'introduction'],
    excerpt: 'Learn the basics of DocuSphere and how to create your first documentation...'
  },
  {
    id: '2',
    title: 'Installation Guide',
    content: 'Step by step instructions to install DocuSphere on your local machine or server. Includes Docker setup and environment configuration.',
    path: '/docs/installation',
    type: 'page',
    lastModified: '2024-01-14',
    author: 'DevOps Team',
    tags: ['installation', 'setup', 'docker'],
    excerpt: 'Complete installation instructions for DocuSphere including Docker setup...'
  },
  {
    id: '3',
    title: 'Rich Text Editor',
    content: 'Learn how to use the powerful TipTap editor with Monaco code blocks, formatting options, and collaborative features.',
    path: '/docs/editor',
    type: 'page',
    lastModified: '2024-01-13',
    author: 'UI Team',
    tags: ['editor', 'formatting', 'collaboration'],
    excerpt: 'Master the rich text editor with advanced formatting and code highlighting...'
  },
  {
    id: '4',
    title: 'API Reference',
    content: 'Complete API documentation for DocuSphere REST and GraphQL endpoints. Includes authentication, CRUD operations, and real-time features.',
    path: '/docs/api',
    type: 'page',
    lastModified: '2024-01-12',
    author: 'Backend Team',
    tags: ['api', 'rest', 'graphql'],
    excerpt: 'Complete API reference with examples and authentication details...'
  },
  {
    id: '5',
    title: 'Themes and Customization',
    content: 'How to customize DocuSphere appearance, create custom themes, and modify the UI to match your brand.',
    path: '/docs/themes',
    type: 'page',
    lastModified: '2024-01-11',
    author: 'Design Team',
    tags: ['themes', 'customization', 'branding'],
    excerpt: 'Customize DocuSphere to match your brand with themes and styling...'
  }
];

const fuse = new Fuse(searchData, {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'content', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
    { name: 'excerpt', weight: 0.1 }
  ],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
});

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<SearchItem | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query === '' 
    ? [] 
    : fuse.search(query).map(result => ({
        ...result.item,
        score: result.score,
        matches: result.matches
      }));

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('docusphere-recent-searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const saveRecentSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('docusphere-recent-searches', JSON.stringify(updated));
    }
  };

  const handleSelect = (item: SearchItem) => {
    saveRecentSearch(query);
    navigate(item.path);
    onClose();
    setQuery('');
  };

  const handleRecentSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('docusphere-recent-searches');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'folder':
        return <FolderIcon className="h-4 w-4" />;
      case 'heading':
        return <HashtagIcon className="h-4 w-4" />;
      default:
        return <DocumentTextIcon className="h-4 w-4" />;
    }
  };

  const highlightMatches = (text: string, matches?: any[]) => {
    if (!matches || !matches.length) return text;
    
    // Simple highlighting - in a real app, you'd want more sophisticated highlighting
    return text;
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
          <div className="flex min-h-full items-start justify-center p-4 text-center sm:p-6 md:p-8">
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
                <Combobox value={selectedItem} onChange={handleSelect}>
                  {/* Search Input */}
                  <div className="relative">
                    <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Combobox.Input
                      ref={inputRef}
                      className="h-12 w-full border-0 bg-transparent pl-11 pr-11 text-foreground placeholder-muted-foreground focus:ring-0 text-base"
                      placeholder="Search documentation..."
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <button
                      onClick={onClose}
                      className="absolute right-4 top-3.5 text-muted-foreground hover:text-foreground"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="border-t border-border">
                    {/* Recent Searches */}
                    {query === '' && recentSearches.length > 0 && (
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-foreground">Recent searches</h3>
                          <button
                            onClick={clearRecentSearches}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="space-y-1">
                          {recentSearches.map((search, index) => (
                            <button
                              key={index}
                              onClick={() => handleRecentSearch(search)}
                              className="flex items-center gap-3 w-full p-2 text-left rounded-lg hover:bg-accent text-sm"
                            >
                              <ClockIcon className="h-4 w-4 text-muted-foreground" />
                              {search}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Search Results */}
                    {results.length > 0 && (
                      <Combobox.Options className="max-h-80 overflow-y-auto p-4 space-y-2">
                        {results.map((item) => (
                          <Combobox.Option
                            key={item.id}
                            value={item}
                            className={({ active }) =>
                              cn(
                                "cursor-pointer select-none rounded-lg p-3 text-left transition-colors",
                                active ? "bg-accent" : ""
                              )
                            }
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-1 text-muted-foreground">
                                {getTypeIcon(item.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-foreground truncate">
                                    {item.title}
                                  </h4>
                                  {item.score && (
                                    <span className="text-xs text-muted-foreground">
                                      {Math.round((1 - item.score) * 100)}% match
                                    </span>
                                  )}
                                </div>
                                {item.excerpt && (
                                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                    {item.excerpt}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  {item.author && (
                                    <span className="flex items-center gap-1">
                                      <UserIcon className="h-3 w-3" />
                                      {item.author}
                                    </span>
                                  )}
                                  {item.lastModified && (
                                    <span className="flex items-center gap-1">
                                      <ClockIcon className="h-3 w-3" />
                                      {new Date(item.lastModified).toLocaleDateString()}
                                    </span>
                                  )}
                                  {item.tags && item.tags.length > 0 && (
                                    <div className="flex gap-1">
                                      {item.tags.slice(0, 2).map((tag, index) => (
                                        <span
                                          key={index}
                                          className="px-1.5 py-0.5 bg-muted rounded text-xs"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    )}

                    {/* No Results */}
                    {query !== '' && results.length === 0 && (
                      <div className="p-8 text-center">
                        <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-sm font-medium text-foreground mb-1">No results found</h3>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search terms or browse the documentation.
                        </p>
                      </div>
                    )}

                    {/* Empty State */}
                    {query === '' && recentSearches.length === 0 && (
                      <div className="p-8 text-center">
                        <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-sm font-medium text-foreground mb-1">Search documentation</h3>
                        <p className="text-sm text-muted-foreground">
                          Find pages, headings, and content across all your docs.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Search powered by Fuse.js</span>
                      <div className="flex items-center gap-2">
                        <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">⌘K</kbd>
                        <span>to search</span>
                      </div>
                    </div>
                  </div>
                </Combobox>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
