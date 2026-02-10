
export interface ImageItem {
  id: string;
  url: string;
  title: string;
}

export enum AppTheme {
  NATURE = 'Nature',
  URBAN = 'Urban',
  SPACE = 'Space',
  ABSTRACT = 'Abstract',
  CUSTOM = 'Custom'
}

export interface SphereConfig {
  radius: number;
  count: number;
  rotationSpeed: number;
  zoom: number;
}
