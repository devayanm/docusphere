import { useState, useEffect } from 'react';
import { 
  UserIcon, 
  EyeIcon, 
  PencilIcon,
  WifiIcon
} from '@heroicons/react/24/outline';
import { cn } from '../lib/utils';

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  status: 'active' | 'idle' | 'typing';
  cursor?: {
    x: number;
    y: number;
  };
  selection?: {
    start: number;
    end: number;
  };
}

interface CollaborationIndicatorsProps {
  className?: string;
}

// Mock collaborators data
const mockCollaborators: Collaborator[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    color: '#3B82F6',
    status: 'typing'
  },
  {
    id: '2',
    name: 'Mike Johnson',
    color: '#10B981',
    status: 'active'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    color: '#F59E0B',
    status: 'idle'
  }
];

export function CollaborationIndicators({ className }: CollaborationIndicatorsProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(mockCollaborators);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCollaborators(prev => 
        prev.map(collab => ({
          ...collab,
          status: Math.random() > 0.7 ? 'typing' : Math.random() > 0.4 ? 'active' : 'idle'
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: Collaborator['status']) => {
    switch (status) {
      case 'typing':
        return <PencilIcon className="h-3 w-3" />;
      case 'active':
        return <EyeIcon className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: Collaborator['status']) => {
    switch (status) {
      case 'typing':
        return 'text-green-600 dark:text-green-400';
      case 'active':
        return 'text-blue-600 dark:text-blue-400';
      case 'idle':
        return 'text-gray-400';
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-500';
      case 'connecting':
        return 'text-yellow-500';
      case 'disconnected':
        return 'text-red-500';
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Connection Status */}
      <div className="flex items-center gap-1">
        <WifiIcon className={cn("h-4 w-4", getConnectionStatusColor())} />
        <span className="text-xs text-muted-foreground capitalize">
          {connectionStatus}
        </span>
      </div>

      {/* Active Collaborators */}
      {collaborators.length > 0 && (
        <>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {collaborators.length} online
            </span>
            <div className="flex -space-x-1">
              {collaborators.slice(0, 4).map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="relative group"
                  title={`${collaborator.name} - ${collaborator.status}`}
                >
                  <div
                    className="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-white text-xs font-medium"
                    style={{ backgroundColor: collaborator.color }}
                  >
                    {collaborator.avatar ? (
                      <img
                        src={collaborator.avatar}
                        alt={collaborator.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      collaborator.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  
                  {/* Status indicator */}
                  <div className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-background flex items-center justify-center",
                    collaborator.status === 'typing' && "bg-green-500",
                    collaborator.status === 'active' && "bg-blue-500",
                    collaborator.status === 'idle' && "bg-gray-400"
                  )}>
                    {collaborator.status === 'typing' && (
                      <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                    )}
                  </div>

                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {collaborator.name}
                    <div className="flex items-center gap-1 mt-0.5">
                      {getStatusIcon(collaborator.status)}
                      <span className="capitalize">{collaborator.status}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {collaborators.length > 4 && (
                <div
                  className="w-6 h-6 rounded-full border-2 border-background bg-gray-400 flex items-center justify-center text-white text-xs font-medium"
                  title={`+${collaborators.length - 4} more`}
                >
                  +{collaborators.length - 4}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Typing Indicator */}
      {collaborators.some(c => c.status === 'typing') && (
        <>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce"></div>
            </div>
            <span className="text-xs text-muted-foreground">
              {collaborators.filter(c => c.status === 'typing').length === 1
                ? `${collaborators.find(c => c.status === 'typing')?.name} is typing...`
                : `${collaborators.filter(c => c.status === 'typing').length} people are typing...`
              }
            </span>
          </div>
        </>
      )}
    </div>
  );
}

// Cursor component for showing other users' cursors
export function CollaboratorCursor({ collaborator, position }: { 
  collaborator: Collaborator; 
  position: { x: number; y: number } 
}) {
  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{ 
        left: position.x, 
        top: position.y,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <div className="flex flex-col items-center">
        <div
          className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium shadow-lg"
          style={{ backgroundColor: collaborator.color }}
        >
          {collaborator.name.charAt(0).toUpperCase()}
        </div>
        <div
          className="mt-1 px-2 py-1 rounded text-xs text-white shadow-lg whitespace-nowrap"
          style={{ backgroundColor: collaborator.color }}
        >
          {collaborator.name}
        </div>
        <div
          className="w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent"
          style={{ borderTopColor: collaborator.color }}
        />
      </div>
    </div>
  );
}

// Selection component for showing other users' text selections
export function CollaboratorSelection({ collaborator, range }: { 
  collaborator: Collaborator; 
  range: { start: number; end: number } 
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        backgroundColor: `${collaborator.color}33`, // 20% opacity
        borderLeft: `2px solid ${collaborator.color}`,
      }}
    >
      <div
        className="absolute -top-5 left-0 px-1 py-0.5 rounded text-xs text-white shadow-sm"
        style={{ backgroundColor: collaborator.color }}
      >
        {collaborator.name}
      </div>
    </div>
  );
}
