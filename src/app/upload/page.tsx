'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Video } from '@/types';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { config } from '@/lib/config';
import {
  UploadCloud,
  FileVideo,
  CheckCircle2,
  X,
  Sparkles,
  Image as ImageIcon,
  Tag,
  Eye,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const { user, addUploadedVideo, openAuthModal } = useApp();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Form Metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tech');
  const [visibility, setVisibility] = useState<'Public' | 'Unlisted' | 'Private'>('Public');
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState<string[]>(['StreamHub', 'Original']);
  const [thumbnailUrl, setThumbnailUrl] = useState(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80'
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const presetThumbnails = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&auto=format&fit=crop&q=80',
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    if (!title) {
      const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setTitle(fileNameWithoutExt);
    }
    // Simulate initial upload chunking
    startUploadSimulation();
  };

  const startUploadSimulation = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsCompleted(true);
          return 100;
        }
        return prev + 12;
      });
    }, 250);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (currentTag.trim() && !tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
        setCurrentTag('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newVideoId = 'upload_' + Date.now();
    const createdVideo: Video = {
      id: newVideoId,
      title: title.trim(),
      description: description.trim() || 'No description provided.',
      videoUrl: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
      thumbnailUrl,
      duration: '03:45',
      durationSec: 225,
      views: 1,
      createdAt: 'Just now',
      channel: user
        ? {
            id: 'ch_' + user.id,
            name: user.name,
            handle: user.handle,
            avatarUrl: user.avatarUrl,
            subscribers: '1',
            subscriberCount: 1,
            isVerified: false,
          }
        : {
            id: 'ch_anon',
            name: 'Creator Studio',
            handle: '@creator',
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            subscribers: '1',
            subscriberCount: 1,
            isVerified: false,
          },
      likes: 1,
      dislikes: 0,
      category,
      tags,
      isHls: false,
    };

    addUploadedVideo(createdVideo);
    router.push(`/watch/${newVideoId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Studio Video Upload</h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload and transcode video media for adaptive HLS playback across StreamHub.
        </p>
      </div>

      {/* Upload Pipeline Status / Cloud Integration Banner */}
      <div className="mb-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 p-4 flex items-center justify-between text-xs text-indigo-300">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-400 flex-shrink-0" />
          <span>
            Transcoding Target:{' '}
            <strong>
              {config.mux.isConfigured
                ? 'Mux Video API (Live)'
                : config.cloudflare.isConfigured
                ? 'Cloudflare Stream (Live)'
                : 'Direct Stream Engine (Mock Pipeline)'}
            </strong>
          </span>
        </div>
        <span className="font-mono text-[11px] bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
          CORS Enabled
        </span>
      </div>

      {/* Step 1: Drop Zone */}
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-white/10 hover:border-indigo-500/50 bg-[#11131a]/60 hover:bg-[#11131a]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm,video/x-matroska"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-indigo-400 shadow-xl">
              <UploadCloud className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              Drag and drop video files to upload
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mb-6">
              Compatible formats: MP4, MOV, WebM, or MKV. Up to 4K resolution.
            </p>
            <button
              type="button"
              className="rounded-full bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition"
            >
              Select Video Files
            </button>
          </div>
        </div>
      ) : (
        /* Step 2: Upload Progress and Metadata Form */
        <form onSubmit={handlePublish} className="space-y-6">
          {/* Progress Card */}
          <div className="rounded-2xl bg-[#11131a] border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <FileVideo className="h-5 w-5 text-indigo-400" />
                <span className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isCompleted ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" /> Ready to Publish
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-indigo-400">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading {uploadProgress}%
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setUploadProgress(0);
                    setIsCompleted(false);
                  }}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 w-full rounded-full bg-black/50 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="rounded-2xl bg-[#11131a] border border-white/5 p-6 space-y-5">
            <h2 className="text-base font-bold text-white tracking-tight">Details & Metadata</h2>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Title (Required)
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your video a compelling title..."
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide viewers with a summary, timestamps, credits, and links..."
                className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
              />
            </div>

            {/* Thumbnail Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-indigo-400" />
                Thumbnail
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {presetThumbnails.map((thumb, idx) => (
                  <div
                    key={idx}
                    onClick={() => setThumbnailUrl(thumb)}
                    className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                      thumbnailUrl === thumb
                        ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img src={thumb} alt="Preview" className="h-full w-full object-cover" />
                    {thumbnailUrl === thumb && (
                      <div className="absolute top-1 right-1 rounded-full bg-indigo-600 p-0.5 text-white">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Category & Visibility Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  {MOCK_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat} className="bg-[#11131a] text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-indigo-400" />
                  Visibility
                </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="Public" className="bg-[#11131a] text-white">Public (Searchable and listed)</option>
                  <option value="Unlisted" className="bg-[#11131a] text-white">Unlisted (Anyone with link)</option>
                  <option value="Private" className="bg-[#11131a] text-white">Private (Only you)</option>
                </select>
              </div>
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-indigo-400" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-2.5 py-1 text-xs text-indigo-300 font-medium"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type a tag and press Enter..."
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Discard Draft
            </button>
            <button
              type="submit"
              disabled={!isCompleted || !title.trim()}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 transition"
            >
              <span>Publish Stream</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
