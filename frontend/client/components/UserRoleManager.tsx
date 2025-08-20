import { useState } from 'react';
import { 
  UserGroupIcon, 
  ShieldCheckIcon, 
  PencilIcon, 
  EyeIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

export type UserRole = 'admin' | 'editor' | 'viewer';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'pending';
}

interface UserRoleManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@company.com',
    role: 'admin',
    lastActive: '2024-01-15T14:30:00Z',
    status: 'active'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@company.com',
    role: 'editor',
    lastActive: '2024-01-15T12:15:00Z',
    status: 'active'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@company.com',
    role: 'editor',
    lastActive: '2024-01-14T16:45:00Z',
    status: 'active'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma@company.com',
    role: 'viewer',
    lastActive: '2024-01-14T09:30:00Z',
    status: 'inactive'
  },
  {
    id: '5',
    name: 'Alex Kumar',
    email: 'alex@company.com',
    role: 'viewer',
    lastActive: 'Never',
    status: 'pending'
  }
];

const roleConfig = {
  admin: {
    label: 'Admin',
    description: 'Full access to all features, user management, and settings',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    icon: ShieldCheckIcon,
    permissions: ['Read', 'Write', 'Delete', 'Manage Users', 'Admin Settings']
  },
  editor: {
    label: 'Editor',
    description: 'Can create, edit, and manage content',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    icon: PencilIcon,
    permissions: ['Read', 'Write', 'Comment', 'Version History']
  },
  viewer: {
    label: 'Viewer',
    description: 'Read-only access to content',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    icon: EyeIcon,
    permissions: ['Read', 'Comment']
  }
};

export function UserRoleManager({ isOpen, onClose }: UserRoleManagerProps) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('viewer');

  const formatTimeAgo = (timestamp: string) => {
    if (timestamp === 'Never') return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const removeUser = (userId: string) => {
    if (confirm('Are you sure you want to remove this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;

    const newUser: User = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      lastActive: 'Never',
      status: 'pending'
    };

    setUsers([...users, newUser]);
    setInviteEmail('');
    setInviteRole('viewer');
    setShowInviteForm(false);
  };

  const getRoleIcon = (role: UserRole) => {
    const IconComponent = roleConfig[role].icon;
    return <IconComponent className="h-4 w-4" />;
  };

  const getStatusBadge = (status: User['status']) => {
    const statusConfig = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      inactive: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };

    return (
      <span className={cn('inline-flex items-center px-2 py-1 rounded-full text-xs font-medium', statusConfig[status])}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-background border-l border-border shadow-lg z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <UserGroupIcon className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">User Management</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-accent rounded transition-colors"
        >
          <XMarkIcon className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Role Overview */}
      <div className="p-4 border-b border-border bg-muted/30">
        <h4 className="text-sm font-medium text-foreground mb-3">Role Permissions</h4>
        <div className="space-y-2">
          {Object.entries(roleConfig).map(([role, config]) => (
            <div key={role} className="flex items-center gap-2 text-xs">
              <span className={cn('inline-flex items-center px-2 py-1 rounded-full font-medium', config.color)}>
                {config.label}
              </span>
              <span className="text-muted-foreground">{config.permissions.join(', ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-foreground">
              Team Members ({users.length})
            </h4>
            <Button
              size="sm"
              onClick={() => setShowInviteForm(true)}
            >
              <PlusIcon className="h-3 w-3 mr-1" />
              Invite
            </Button>
          </div>

          {/* Invite Form */}
          {showInviteForm && (
            <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border">
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="user@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full p-2 text-sm border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full p-2 text-sm border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleInvite} className="flex-1">
                    Send Invite
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowInviteForm(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-foreground truncate">
                        {user.name}
                      </span>
                      {getStatusBadge(user.status)}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {user.email}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last active: {formatTimeAgo(user.lastActive)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                    className="text-xs p-1 border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>

                  <button
                    onClick={() => removeUser(user.id)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="text-xs text-muted-foreground text-center">
          <p>Manage team access and permissions</p>
          <p className="mt-1">Changes take effect immediately</p>
        </div>
      </div>
    </div>
  );
}
