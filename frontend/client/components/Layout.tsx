import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import {
  BookOpenIcon,
  Bars3Icon,
  SunIcon,
  MoonIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import { useSearch } from '../hooks/useSearch';
import { Sidebar } from './Sidebar';
import { SearchModal } from './SearchModal';
import { Button } from './ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isSearchOpen, openSearch, closeSearch } = useSearch();

  // Close sidebar when clicking outside on mobile
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay with animation */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main content */}
      <div className="lg:pl-80 transition-all duration-300">
        {/* Enhanced Header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
          <div className="flex h-14 sm:h-16 items-center gap-2 sm:gap-4 px-3 sm:px-4 lg:px-8">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 h-8 w-8"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-5 w-5" />
            </Button>

            {/* Logo for mobile */}
            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <BookOpenIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <span className="text-lg sm:text-xl font-bold text-foreground hidden xs:block">DocuSphere</span>
            </Link>

            {/* Search trigger */}
            <div className="flex-1 max-w-xs sm:max-w-md ml-auto lg:ml-0">
              <button
                onClick={openSearch}
                className="w-full flex items-center gap-2 sm:gap-3 pl-3 sm:pl-3 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm rounded-lg border border-border bg-background hover:bg-accent transition-all text-left"
              >
                <MagnifyingGlassIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground flex-1 truncate">Search docs...</span>
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>
            </div>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="ml-2 sm:ml-4 p-2 h-8 w-8 sm:h-9 sm:w-9 transition-all hover:scale-105"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <MoonIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <SunIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-3 sm:p-4 md:p-6 lg:p-8 min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)]">
          {/* ✅ FIX: removed overflow-x-auto so toolbar buttons (History, Comments, etc.) don’t disappear */}
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </div>
  );
}
