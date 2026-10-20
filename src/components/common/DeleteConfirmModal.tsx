'use client';

import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  videoTitle: string;
  thumbnailUrl?: string;
  isOwner?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  videoTitle,
  thumbnailUrl,
  isOwner = true,
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl glass-dropdown p-6 shadow-2xl border border-white/10 text-left">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition disabled:opacity-50"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-11 w-11 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 flex-shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Delete Movie</h3>
            <p className="text-xs text-rose-400/90 font-medium">Permanent Server Action</p>
          </div>
        </div>

        {thumbnailUrl && (
          <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-4 border border-white/10 bg-black/50">
            <img src={thumbnailUrl} alt={videoTitle} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
              <p className="text-xs font-semibold text-white truncate max-w-full">{videoTitle}</p>
            </div>
          </div>
        )}

        <div className="space-y-2 text-xs text-slate-300 mb-6 bg-white/[0.03] border border-white/5 p-3.5 rounded-xl">
          <p>
            Are you sure you want to permanently delete{' '}
            <strong className="text-white">&ldquo;{videoTitle}&rdquo;</strong> from StreamHub?
          </p>
          <p className="text-slate-400">
            {isOwner
              ? 'As the owner, this will remove this movie asset from the server, stream endpoints, and user libraries.'
              : 'This will remove the uploaded movie and its transcode pipeline.'}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Movie</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
