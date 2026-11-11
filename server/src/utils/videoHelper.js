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

const iframeAllowlist = new Set([...YOUTUBE_HOSTS, ...VIMEO_HOSTS]);

const getHostname = (url) => {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return '';
  }
};

export const parseVideoUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return {
      provider: 'unknown',
      isValid: false,
      embedUrl: '',
      originalUrl: ''
    };
  }

  const url = rawUrl.trim();

  if (!/^https?:\/\//i.test(url)) {
    return {
      provider: 'unknown',
      isValid: false,
      embedUrl: '',
      originalUrl: url,
      error: 'Invalid URL protocol. Must use http or https.'
    };
  }

  const ytMatch = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i
  );
  if (ytMatch && ytMatch[1] && YOUTUBE_HOSTS.has(getHostname(url))) {
    const videoId = ytMatch[1];
    return {
      provider: 'youtube',
      isValid: true,
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&enablejsapi=1`,
      originalUrl: url
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
      originalUrl: url
    };
  }

  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) && /^https:\/\//i.test(url)) {
    return {
      provider: 'direct',
      isValid: true,
      embedUrl: url,
      originalUrl: url
    };
  }

  if (/^https:\/\//i.test(url)) {
    const host = getHostname(url);
    if (iframeAllowlist.has(host)) {
      return {
        provider: 'embed',
        isValid: true,
        embedUrl: url,
        originalUrl: url
      };
    }

    return {
      provider: 'external',
      isValid: true,
      embedUrl: '',
      originalUrl: url
    };
  }

  return {
    provider: 'unknown',
    isValid: false,
    embedUrl: '',
    originalUrl: url,
    error: 'Unrecognized video provider or format'
  };
};

export const assertSafeMediaUrl = (rawUrl) => {
  if (!rawUrl) return null;
  const parsed = parseVideoUrl(rawUrl);
  if (!parsed.isValid) {
    return parsed;
  }
  return parsed;
};
