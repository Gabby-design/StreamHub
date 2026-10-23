'use client';

import React, { useState, useEffect } from 'react';
import { Comment } from '@/types';
import { useApp } from '@/context/AppContext';
import {
  ThumbsUp,
  ThumbsDown,
  ArrowUpDown,
  CornerDownRight,
  Send,
  User,
} from 'lucide-react';

interface CommentsSectionProps {
  videoId: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ videoId }) => {
  const { user, commentsMap, addComment, voteComment } = useApp();
  const [mounted, setMounted] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'top' | 'newest'>('top');

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  const comments: Comment[] = commentsMap[videoId] || [];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(videoId, commentText.trim());
    setCommentText('');
  };

  const handleAddReply = (parentCommentId: string) => {
    const text = replyTextMap[parentCommentId];
    if (!text || !text.trim()) return;
    addComment(videoId, text.trim(), parentCommentId);
    setReplyTextMap((prev) => ({ ...prev, [parentCommentId]: '' }));
    setActiveReplyId(null);
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'top') {
      return b.likes - a.likes;
    }
    return b.id.localeCompare(a.id);
  });

  return (
    <div className="mt-8 border-t border-white/5 pt-6">
      {/* Header & Sorting */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white tracking-tight">
            {comments.length} Comments
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <button
              onClick={() => setSortBy(sortBy === 'top' ? 'newest' : 'top')}
              className="flex items-center gap-1 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>Sort: {sortBy === 'top' ? 'Top Comments' : 'Newest First'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Comment Input Form */}
      <form onSubmit={handleAddComment} className="flex items-start gap-3 mb-8">
        {mounted && user ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10 mt-0.5"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-slate-400 mt-0.5">
            <User className="h-5 w-5" />
          </div>
        )}

        <div className="flex-1">
          <textarea
            rows={2}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a constructive comment or discussion..."
            className="w-full rounded-xl bg-[#11131a] border border-white/10 p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
          />
          <div className="flex justify-end gap-2 mt-2">
            {commentText && (
              <button
                type="button"
                onClick={() => setCommentText('')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-1.5 text-xs font-semibold text-white transition shadow-md shadow-indigo-600/20"
            >
              <Send className="h-3 w-3" />
              <span>Comment</span>
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {sortedComments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3.5 group">
            <img
              src={comment.author.avatarUrl}
              alt={comment.author.name}
              className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10 mt-1"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">
                  {comment.author.name}
                </span>
                <span className="text-[11px] text-slate-400">{comment.author.handle}</span>
                <span className="text-[11px] text-slate-500">• {comment.createdAt}</span>
              </div>

              <p className="mt-1 text-sm text-slate-300 leading-relaxed break-words">
                {comment.content}
              </p>

              {/* Vote & Reply Buttons */}
              <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                <button
                  onClick={() => voteComment(videoId, comment.id, 'like')}
                  className={`flex items-center gap-1.5 hover:text-white transition ${
                    comment.userVote === 'like' ? 'text-indigo-400 font-semibold' : ''
                  }`}
                >
                  <ThumbsUp className={`h-3.5 w-3.5 ${comment.userVote === 'like' ? 'fill-current' : ''}`} />
                  <span>{comment.likes}</span>
                </button>

                <button
                  onClick={() => voteComment(videoId, comment.id, 'dislike')}
                  className={`hover:text-white transition ${
                    comment.userVote === 'dislike' ? 'text-rose-400 font-semibold' : ''
                  }`}
                >
                  <ThumbsDown className={`h-3.5 w-3.5 ${comment.userVote === 'dislike' ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() =>
                    setActiveReplyId(activeReplyId === comment.id ? null : comment.id)
                  }
                  className="hover:text-white font-medium transition"
                >
                  Reply
                </button>
              </div>

              {/* Nested Reply Input */}
              {activeReplyId === comment.id && (
                <div className="mt-3 flex items-start gap-2.5 pl-2 border-l-2 border-indigo-500/30">
                  <input
                    type="text"
                    value={replyTextMap[comment.id] || ''}
                    onChange={(e) =>
                      setReplyTextMap({ ...replyTextMap, [comment.id]: e.target.value })
                    }
                    placeholder={`Reply to ${comment.author.name}...`}
                    className="flex-1 rounded-lg bg-black/40 border border-white/10 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => handleAddReply(comment.id)}
                    className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white transition"
                  >
                    Reply
                  </button>
                </div>
              )}

              {/* Nested Replies Rendering */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 pl-4 border-l border-white/10 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start gap-2.5">
                      <CornerDownRight className="h-3.5 w-3.5 text-slate-500 mt-1 flex-shrink-0" />
                      <img
                        src={reply.author.avatarUrl}
                        alt={reply.author.name}
                        className="h-7 w-7 rounded-full object-cover ring-1 ring-white/10 mt-0.5"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">
                            {reply.author.name}
                          </span>
                          <span className="text-[10px] text-slate-500">• {reply.createdAt}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
