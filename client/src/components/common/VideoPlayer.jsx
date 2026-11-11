import React, { useEffect, useState } from 'react';
import { Play, AlertCircle, FileText, ExternalLink, Video } from 'lucide-react';

const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'www.youtu.be',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com'
]);

const VIMEO_HOSTS = new Set(['vimeo.com', 'www.vimeo.com', 'player.vimeo.com']);

const getHostname = (url) => {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return '';
  }
};

export const parseClientVideoUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return { provider: 'unknown', isValid: false, url: '' };
  const url = rawUrl.trim();

  if (!/^https?:\/\//i.test(url)) {
    return { provider: 'unknown', isValid: false, url };
  }

  const ytMatch = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i
  );
  if (ytMatch?.[1] && YOUTUBE_HOSTS.has(getHostname(url))) {
    return {
      provider: 'youtube',
      isValid: true,
      videoId: ytMatch[1],
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`,
      url
    };
  }

  const vimeoMatch = url.match(
    /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)|player\.vimeo\.com\/video\/(\d+))/i
  );
  const vimeoId = vimeoMatch ? vimeoMatch[3] || vimeoMatch[4] : null;
  if (vimeoId && VIMEO_HOSTS.has(getHostname(url))) {
    return {
      provider: 'vimeo',
      isValid: true,
      videoId: vimeoId,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?dnt=1`,
      url
    };
  }

  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) && /^https:\/\//i.test(url)) {
    return { provider: 'direct', isValid: true, embedUrl: url, url };
  }

  if (/^https:\/\//i.test(url)) {
    return { provider: 'external', isValid: true, embedUrl: '', url };
  }

  return { provider: 'unknown', isValid: false, url };
};

export const VideoPlayer = ({ lesson, onEnded, className = '' }) => {
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setLoadError(false);
  }, [lesson?._id, lesson?.videoUrl, lesson?.embedUrl]);

  if (!lesson) {
    return (
      <div className={`aspect-video w-full bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-400 ${className}`}>
        <Video className="w-12 h-12 mb-2 text-slate-600" aria-hidden="true" />
        <p className="text-sm">Select a lesson to begin learning</p>
      </div>
    );
  }

  if (lesson.contentType === 'text') {
    return (
      <div className={`w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm ${className}`}>
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-full w-fit text-xs font-semibold mb-4">
          <FileText className="w-3.5 h-3.5" aria-hidden="true" /> Reading &amp; Concept Lesson
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{lesson.title}</h2>
        <div className="max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-base">
          {lesson.description || 'No reading notes provided for this lesson.'}
        </div>
      </div>
    );
  }

  const parsed = lesson.videoData?.isValid
    ? lesson.videoData
    : parseClientVideoUrl(lesson.videoUrl || lesson.embedUrl);
  const rawUrl = parsed.originalUrl || parsed.url || lesson.videoUrl || lesson.embedUrl;

  if (parsed.provider === 'external' && parsed.isValid) {
    return (
      <div className={`aspect-video w-full bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-300 p-6 text-center ${className}`}>
        <ExternalLink className="w-12 h-12 mb-3 text-brand-400" aria-hidden="true" />
        <h3 className="text-lg font-bold text-white mb-1">External video</h3>
        <p className="text-xs text-slate-400 max-w-md mb-4">
          This lesson uses an external link. It is opened in a new tab instead of being embedded, to keep the player secure.
        </p>
        <a
          href={rawUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 min-h-11 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold transition"
        >
          Open video <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>
    );
  }

  if (!parsed.isValid || loadError) {
    return (
      <div className={`aspect-video w-full bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-300 p-6 text-center ${className}`}>
        <AlertCircle className="w-12 h-12 mb-3 text-amber-400" aria-hidden="true" />
        <h3 className="text-lg font-bold text-white mb-1">Video stream unavailable</h3>
        <p className="text-xs text-slate-400 max-w-md mb-4">
          {rawUrl
            ? 'The video link could not be loaded or is in an unsupported format.'
            : 'No video URL has been configured for this lesson yet.'}
        </p>
        {rawUrl && /^https?:\/\//i.test(rawUrl) && (
          <a
            href={rawUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 min-h-11 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
          >
            Open external link <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        )}
      </div>
    );
  }

  if (parsed.provider === 'youtube' || parsed.provider === 'vimeo' || parsed.provider === 'embed') {
    return (
      <div className={`relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 ${className}`}>
        <iframe
          src={parsed.embedUrl}
          title={lesson.title || 'Lesson video player'}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation"
          referrerPolicy="no-referrer"
          onError={() => setLoadError(true)}
        />
      </div>
    );
  }

  if (parsed.provider === 'direct') {
    return (
      <div className={`relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl ${className}`}>
        <video
          src={parsed.embedUrl}
          controls
          playsInline
          onEnded={onEnded}
          onError={() => setLoadError(true)}
          className="w-full h-full object-contain"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className={`aspect-video w-full bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 ${className}`}>
      <Play className="w-10 h-10" aria-hidden="true" />
    </div>
  );
};
