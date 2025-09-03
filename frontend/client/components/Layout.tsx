import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpenIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useSearch } from "../hooks/useSearch";
import { Sidebar } from "./Sidebar";
import { SearchModal } from "./SearchModal";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isSearchOpen, openSearch, closeSearch } = useSearch();
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      />
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="lg:pl-80 transition-all duration-300">
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
          <div className="flex h-14 sm:h-16 items-center gap-2 sm:gap-4 px-3 sm:px-4 lg:px-8">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 h-8 w-8"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-5 w-5" />
            </Button>
            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <BookOpenIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <span className="text-lg sm:text-xl font-bold text-foreground hidden xs:block">
                DocuSphere
              </span>
            </Link>
            <div className="flex-1 max-w-xs sm:max-w-md ml-auto lg:ml-0">
              <button
                onClick={openSearch}
                className="w-full flex items-center gap-2 sm:gap-3 pl-3 pr-3 py-1.5 text-sm rounded-lg border bg-background hover:bg-accent transition-all text-left"
              >
                <MagnifyingGlassIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground flex-1 truncate">
                  Search docs...
                </span>
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>
            </div>
            <div className="ml-2 sm:ml-4">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="p-3 sm:p-4 md:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          <div className="max-w-full overflow-x-auto">{children}</div>
        </main>
      </div>
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </div>
  );
}
