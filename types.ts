
export type TabType = 'Render' | 'Video' | 'Improve' | 'Upscale' | 'Sync' | 'Edit' | 'Canvas' | 'Utilities';

export type RenderMode = 'Exterior' | 'Interior' | 'Floorplan3D' | '3DFloorplan' | 'Masterplan';

export interface RenderParams {
  prompt: string;
  style: string;
  lighting: string;
  tone: string;
  aspectRatio: string;
  numImages: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}
