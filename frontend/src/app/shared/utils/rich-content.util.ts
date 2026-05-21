export type RichContentBlockType = 'heading' | 'paragraph' | 'list' | 'image' | 'video';

export interface RichContentBlock {
  type: RichContentBlockType;
  text?: string;
  level?: 2 | 3;
  items?: string[];
  url?: string;
  caption?: string;
}

const IMAGE_LINE_REGEX = /^\[image\]\((.+?)\)(?:\s*\|\s*(.+))?$/i;
const VIDEO_LINE_REGEX = /^\[video\]\((.+?)\)(?:\s*\|\s*(.+))?$/i;
const IMAGE_URL_REGEX = /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i;

function isVideoUrl(value: string): boolean {
  if (!isValidHttpUrl(value)) {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be') || parsed.hostname.includes('vimeo.com');
  } catch {
    return false;
  }
}

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function isImageUrl(value: string): boolean {
  return isValidHttpUrl(value) && !isVideoUrl(value) && (IMAGE_URL_REGEX.test(value) || value.startsWith('http'));
}

export function getVideoEmbedUrl(url: string): string | null {
  if (!isValidHttpUrl(url)) {
    return null;
  }

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (parsed.hostname.includes('youtu.be')) {
      const videoId = parsed.pathname.replace('/', '');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (parsed.hostname.includes('vimeo.com')) {
      const videoId = parsed.pathname.split('/').filter(Boolean)[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }

    return null;
  } catch {
    return null;
  }
}

export function parseRichContent(raw: string | undefined | null): RichContentBlock[] {
  if (!raw) {
    return [];
  }

  const lines = raw.split(/\r?\n/);
  const blocks: RichContentBlock[] = [];

  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) {
      return;
    }

    blocks.push({
      type: 'paragraph',
      text: paragraphBuffer.join(' ').trim()
    });

    paragraphBuffer = [];
  };

  const flushList = () => {
    if (listBuffer.length === 0) {
      return;
    }

    blocks.push({
      type: 'list',
      items: [...listBuffer]
    });

    listBuffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.length === 0) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading2 = line.match(/^##\s+(.+)/);
    if (heading2) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: 2, text: heading2[1].trim() });
      continue;
    }

    const heading3 = line.match(/^###\s+(.+)/);
    if (heading3) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: 3, text: heading3[1].trim() });
      continue;
    }

    const image = line.match(IMAGE_LINE_REGEX);
    if (image) {
      flushParagraph();
      flushList();
      const imageUrl = image[1].trim();
      if (isValidHttpUrl(imageUrl)) {
        blocks.push({
          type: 'image',
          url: imageUrl,
          caption: image[2]?.trim()
        });
      }
      continue;
    }

    if (isVideoUrl(line)) {
      flushParagraph();
      flushList();
      blocks.push({
        type: 'video',
        url: line
      });
      continue;
    }

    if (isImageUrl(line)) {
      flushParagraph();
      flushList();
      blocks.push({
        type: 'image',
        url: line
      });
      continue;
    }

    const video = line.match(VIDEO_LINE_REGEX);
    if (video) {
      flushParagraph();
      flushList();
      const videoUrl = video[1].trim();
      if (isValidHttpUrl(videoUrl)) {
        blocks.push({
          type: 'video',
          url: videoUrl,
          caption: video[2]?.trim()
        });
      }
      continue;
    }

    const listItem = line.match(/^-\s+(.+)/);
    if (listItem) {
      flushParagraph();
      listBuffer.push(listItem[1].trim());
      continue;
    }

    flushList();
    paragraphBuffer.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}
