
import { AspectRatio } from './types';

export const MODELS = {
  BASIC: 'gemini-2.5-flash-image',
  PRO: 'gemini-3-pro-image-preview',
  CHAT: 'gemini-3-flash-preview'
};

export const RATIOS: { label: string; value: AspectRatio; icon: string }[] = [
  { label: 'Square', value: '1:1', icon: 'M4 4h16v16H4z' },
  { label: 'Portrait', value: '3:4', icon: 'M6 2h12v20H6z' },
  { label: 'Landscape', value: '4:3', icon: 'M2 6h20v12H2z' },
  { label: 'Story', value: '9:16', icon: 'M7 2h10v20H7z' },
  { label: 'Wide', value: '16:9', icon: 'M1 7h22v10H1z' },
];

export const APP_NAME = "Vex AI";
