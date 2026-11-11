import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { parseVideoUrl } from '../src/utils/videoHelper.js';

describe('Video Security and Provider Parsing', () => {
  test('Correctly identifies and sanitizes standard YouTube watch URL', () => {
    const res = parseVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    assert.equal(res.isValid, true);
    assert.equal(res.provider, 'youtube');
    assert.equal(res.videoId, 'dQw4w9WgXcQ');
    assert.equal(res.embedUrl, 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&enablejsapi=1');
  });

  test('Correctly parses short youtu.be links', () => {
    const res = parseVideoUrl('https://youtu.be/W6NZfCO5SIk');
    assert.equal(res.isValid, true);
    assert.equal(res.provider, 'youtube');
    assert.equal(res.videoId, 'W6NZfCO5SIk');
  });

  test('Correctly identifies and formats Vimeo links', () => {
    const res = parseVideoUrl('https://vimeo.com/76979871');
    assert.equal(res.isValid, true);
    assert.equal(res.provider, 'vimeo');
    assert.equal(res.videoId, '76979871');
    assert.equal(res.embedUrl, 'https://player.vimeo.com/video/76979871?dnt=1');
  });

  test('Correctly identifies direct MP4 video URLs', () => {
    const res = parseVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    assert.equal(res.isValid, true);
    assert.equal(res.provider, 'direct');
    assert.equal(res.embedUrl, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  });

  test('Rejects dangerous protocols (javascript: XSS attempt)', () => {
    const res = parseVideoUrl('javascript:alert("XSS")');
    assert.equal(res.isValid, false);
    assert.equal(res.provider, 'unknown');
  });

  test('Rejects data URIs', () => {
    const res = parseVideoUrl('data:text/html,<script>alert(1)</script>');
    assert.equal(res.isValid, false);
    assert.equal(res.provider, 'unknown');
  });
});
