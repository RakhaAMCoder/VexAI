
export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type ImageSize = '1K' | '2K' | '4K';

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: AspectRatio;
  timestamp: number;
  size?: ImageSize;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
