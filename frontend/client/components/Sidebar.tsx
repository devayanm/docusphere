import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  Active,
  Over,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  BookOpenIcon,
  DocumentTextIcon,
  FolderIcon,
  ChevronRightIcon,
  XMarkIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  StarIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useFavorites } from '../hooks/useFavorites';
import { cn } from '../lib/utils';

interface NavItem {
  id: string;
  title: string;
  path: string;
  type: 'folder' | 'page';
  children?: NavItem[];
  isOpen?: boolean;
}

// Sample navigation items
const defaultNavItems: NavItem[] = [
  {
    id: '1',
    title: 'Getting Started',
    path: '/docs/getting-started',
    type: 'folder',
    isOpen: true,
    children: [
      { id: '1-1', title: 'Introduction', path: '/docs/introduction', type: 'page' },
      { id: '1-2', title: 'Installation', path: '/docs/installation', type: 'page' },
      { id: '1-3', title: 'Quick Start', path: '/docs/quick-start', type: 'page' },
    ]
  },
  {
    id: '2',
    title: 'Core Concepts',
    path: '/docs/core-concepts',
    type: 'folder',
    isOpen: false,
    children: [
      { id: '2-1', title: 'Pages & Folders', path: '/docs/pages-folders', type: 'page' },
      { id: '2-2', title: 'Markdown Support', path: '/docs/markdown', type: 'page' },
      { id: '2-3', title: 'Collaboration', path: '/docs/collaboration', type: 'page' },
    ]
  },
  {
    id: '3',
    title: 'API Reference',
    path: '/docs/api',
    type: 'page'
  },
  {
    id: '4',
    title: 'Integrations',
    path: '/docs/integrations',
    type: 'folder',
    isOpen: false,
    children: [
      { id: '4-1', title: 'GitHub Sync', path: '/docs/github-sync', type: 'page' },
      { id: '4-2', title: 'REST API', path: '/docs/rest-api', type: 'page' },
      { id: '4-3', title: 'GraphQL', path: '/docs/graphql', type: 'page' },
    ]
  }
];

interface SortableItemProps {
  item: NavItem;
  depth?: number;
  onToggle?: (id: string) => void;
}

function SortableItem({ item, depth = 0, onToggle }: SortableItemProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const location = useLocation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: item.id,
    data: {
      type: item.type,
      depth: depth,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
  };

  const isActive = location.pathname === item.path;

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        className={cn(
          "group flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer transition-all duration-200",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm",
          "border-2 border-transparent relative",
          isActive && "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm",
          isDragging && "opacity-60 shadow-lg scale-105 bg-sidebar-accent border-sidebar-primary/30 z-10",
          isOver && "border-sidebar-primary/50 bg-sidebar-accent/50 shadow-md animate-pulse",
          depth > 0 && "ml-6"
        )}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        {/* Drop indicator */}
        {isOver && !isDragging && (
          <div className="absolute inset-0 bg-sidebar-primary/10 rounded-lg border-2 border-sidebar-primary/30 pointer-events-none" />
        )}
        {/* Drag handle */}
        <div
          {...listeners}
          className={cn(
            "opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1 -ml-1 transition-all duration-200",
            "hover:bg-sidebar-accent rounded flex items-center justify-center",
            "hover:shadow-sm active:shadow-md",
            isDragging && "opacity-100 bg-sidebar-accent shadow-md"
          )}
          title="Drag to reorder"
        >
          <div className="flex flex-col gap-0.5">
            <div className="w-1 h-1 bg-sidebar-foreground/40 rounded-full"></div>
            <div className="w-1 h-1 bg-sidebar-foreground/40 rounded-full"></div>
            <div className="w-1 h-1 bg-sidebar-foreground/40 rounded-full"></div>
            <div className="w-1 h-1 bg-sidebar-foreground/40 rounded-full"></div>
            <div className="w-1 h-1 bg-sidebar-foreground/40 rounded-full"></div>
            <div className="w-1 h-1 bg-sidebar-foreground/40 rounded-full"></div>
          </div>
        </div>

        {/* Folder toggle */}
        {item.type === 'folder' && (
          <button
            onClick={() => onToggle?.(item.id)}
            className="p-1 -ml-1 hover:bg-background/50 rounded"
          >
            <ChevronRightIcon 
              className={cn(
                "h-4 w-4 transition-transform",
                item.isOpen && "transform rotate-90"
              )} 
            />
          </button>
        )}

        {/* Icon */}
        {item.type === 'folder' ? (
          <FolderIcon className="h-4 w-4 flex-shrink-0" />
        ) : (
          <DocumentTextIcon className="h-4 w-4 flex-shrink-0" />
        )}

        {/* Title */}
        <Link
          to={item.path}
          className="flex-1 truncate hover:no-underline"
          onClick={(e) => item.type === 'folder' && e.preventDefault()}
        >
          {item.title}
        </Link>

        {/* Star button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite({
              id: item.id,
              title: item.title,
              path: item.path,
              type: item.type
            });
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-sidebar-accent rounded transition-all duration-200"
          title={isFavorite(item.id) ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite(item.id) ? (
            <StarIconSolid className="h-3 w-3 text-yellow-500" />
          ) : (
            <StarIcon className="h-3 w-3 text-sidebar-foreground/60 hover:text-yellow-500" />
          )}
        </button>
      </div>

      {/* Children */}
      {item.type === 'folder' && item.isOpen && item.children && (
        <div className="mt-1">
          {item.children.map((child) => (
            <SortableItem
              key={child.id}
              item={child}
              depth={depth + 1}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [navItems, setNavItems] = useState<NavItem[]>(defaultNavItems);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { favorites } = useFavorites();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setIsDragging(false);

    if (active.id !== over?.id && over?.id) {
      setNavItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }
  };

  const toggleFolder = (id: string) => {
    setNavItems(items =>
      items.map(item =>
        item.id === id ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  return (
    <>
      {/* Enhanced Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-sidebar border-r border-sidebar-border shadow-lg lg:shadow-none",
        "transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Enhanced Header */}
          <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 border-b border-sidebar-border bg-sidebar">
            <Link to="/" className="flex items-center gap-2" onClick={onClose}>
              <BookOpenIcon className="h-6 w-6 sm:h-8 sm:w-8 text-sidebar-primary" />
              <span className="text-lg sm:text-xl font-bold text-sidebar-foreground">DocuSphere</span>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 sm:p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="h-5 w-5 text-sidebar-foreground" />
            </button>
          </div>

          {/* Enhanced Navigation */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            <div className="space-y-1 sm:space-y-2">
              {/* Enhanced Add new page button */}
              <button className="w-full flex items-center gap-2 px-3 py-2.5 sm:py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                <PlusIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Add new page</span>
              </button>

              {/* Favorites Section */}
              {favorites.length > 0 && (
                <div className="pt-4">
                  <div className="flex items-center gap-2 px-3 py-1 mb-2">
                    <StarIcon className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wide">
                      Favorites
                    </span>
                  </div>
                  <div className="space-y-1">
                    {favorites.map((favorite) => (
                      <Link
                        key={`favorite-${favorite.id}`}
                        to={favorite.path}
                        onClick={onClose}
                        className="group flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-sidebar-accent transition-colors"
                      >
                        {favorite.type === 'folder' ? (
                          <FolderIcon className="h-4 w-4 flex-shrink-0 text-sidebar-foreground/60" />
                        ) : (
                          <DocumentTextIcon className="h-4 w-4 flex-shrink-0 text-sidebar-foreground/60" />
                        )}
                        <span className="flex-1 truncate text-sidebar-foreground">
                          {favorite.title}
                        </span>
                        <StarIconSolid className="h-3 w-3 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation items */}
              <div className={cn("pt-4", favorites.length === 0 && "pt-2")}>
                <div className="flex items-center gap-2 px-3 py-1 mb-2">
                  <BookOpenIcon className="h-4 w-4 text-sidebar-foreground/60" />
                  <span className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wide">
                    Documentation
                  </span>
                </div>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={navItems.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {navItems.map((item) => (
                      <SortableItem
                        key={item.id}
                        item={item}
                        onToggle={toggleFolder}
                      />
                    ))}
                  </SortableContext>

                  <DragOverlay>
                    {activeId ? (
                      <div className="bg-sidebar-primary text-sidebar-primary-foreground px-3 py-2 text-sm rounded-lg shadow-lg border border-sidebar-border flex items-center gap-2 opacity-95">
                        {(() => {
                          const draggedItem = navItems.find(item => item.id === activeId);
                          if (draggedItem) {
                            return (
                              <>
                                {draggedItem.type === 'folder' ? (
                                  <FolderIcon className="h-4 w-4 flex-shrink-0" />
                                ) : (
                                  <DocumentTextIcon className="h-4 w-4 flex-shrink-0" />
                                )}
                                <span className="truncate">{draggedItem.title}</span>
                              </>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="text-xs text-sidebar-foreground/60">
              DocuSphere v1.0.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
