import { useState, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon, 
  XMarkIcon,
  UserCircleIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { HandThumbUpIcon as ThumbUpSolid } from '@heroicons/react/24/solid';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  replies?: Comment[];
  likes: number;
  isLiked: boolean;
  isResolved?: boolean;
}

interface CommentsPanelProps {
  pageId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: '1',
    author: 'Sarah Chen',
    content: 'This section could use more examples of the drag and drop functionality. Maybe a video or GIF would help?',
    timestamp: '2024-01-15T10:30:00Z',
    likes: 3,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        author: 'Mike Johnson',
        content: 'Great suggestion! I\'ll work on adding a demo video this week.',
        timestamp: '2024-01-15T14:20:00Z',
        likes: 1,
        isLiked: true,
      }
    ]
  },
  {
    id: '2',
    author: 'Alex Kumar',
    content: 'The Monaco editor integration is fantastic! How difficult would it be to add custom language support?',
    timestamp: '2024-01-14T16:45:00Z',
    likes: 5,
    isLiked: true,
    isResolved: true
  },
  {
    id: '3',
    author: 'Emma Wilson',
    content: 'Found a small typo in the third paragraph - "DocuSpehere" should be "DocuSphere"',
    timestamp: '2024-01-14T09:15:00Z',
    likes: 0,
    isLiked: false
  }
];

export function CommentsPanel({ pageId, isOpen, onClose }: CommentsPanelProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleAddReply = (parentId: string) => {
    if (!replyContent.trim()) return;

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      author: 'You',
      content: replyContent,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    setComments(comments.map(comment => 
      comment.id === parentId 
        ? { ...comment, replies: [...(comment.replies || []), reply] }
        : comment
    ));
    
    setReplyContent('');
    setReplyingTo(null);
  };

  const toggleLike = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
        };
      }
      
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply => 
            reply.id === commentId
              ? {
                  ...reply,
                  isLiked: !reply.isLiked,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
                }
              : reply
          )
        };
      }
      
      return comment;
    }));
  };

  const resolveComment = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, isResolved: !comment.isResolved }
        : comment
    ));
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={cn("p-3 rounded-lg border border-border bg-background", isReply && "ml-8 mt-2")}>
      <div className="flex items-start gap-3">
        <UserCircleIcon className="h-8 w-8 text-muted-foreground flex-shrink-0 mt-0.5" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-foreground">{comment.author}</span>
            <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.timestamp)}</span>
            {comment.isResolved && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Resolved
              </span>
            )}
          </div>
          
          <p className="text-sm text-foreground mb-2 leading-relaxed">{comment.content}</p>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleLike(comment.id)}
              className={cn(
                "flex items-center gap-1 text-xs hover:text-foreground transition-colors",
                comment.isLiked ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
              )}
            >
              <HandThumbUpIcon className="h-3 w-3" />
              {comment.likes > 0 && comment.likes}
            </button>
            
            {!isReply && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Reply
              </button>
            )}
            
            {!isReply && (
              <button
                onClick={() => resolveComment(comment.id)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {comment.isResolved ? 'Unresolve' : 'Resolve'}
              </button>
            )}
          </div>
          
          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-3 p-3 bg-muted/30 rounded-lg">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full p-2 text-sm border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={2}
              />
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  onClick={() => handleAddReply(comment.id)}
                  disabled={!replyContent.trim()}
                >
                  Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border shadow-lg z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Comments</h3>
          <span className="text-sm text-muted-foreground">({comments.length})</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-accent rounded transition-colors"
        >
          <XMarkIcon className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No comments yet</p>
            <p className="text-xs">Start a discussion about this page</p>
          </div>
        ) : (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>

      {/* New Comment Form */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <UserCircleIcon className="h-8 w-8 text-muted-foreground flex-shrink-0 mt-1" />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 text-sm border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="flex items-center gap-1"
              >
                <PaperAirplaneIcon className="h-3 w-3" />
                Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
