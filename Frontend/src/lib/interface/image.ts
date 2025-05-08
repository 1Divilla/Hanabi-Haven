export interface StrapiImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width?: number;
  height?: number;
  size?: number;
  url?: string;
}

export interface StrapiImageFormats {
  thumbnail?: StrapiImageFormat;
  small?: StrapiImageFormat;
  medium?: StrapiImageFormat;
  large?: StrapiImageFormat;
}

export interface StrapiImage {
  id: number;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width?: number;
  height: number;
  hash: string;
  ext: string;
  mime: string;
  size?: number;
  url?: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  createdAt: string;
  updatedAt?: string;
  formats: StrapiImageFormats | null;
  documentId?: string;
}
