export interface GalleryItem {
  id: string;
  mediaId: string;
  sequence: number;
  media: { url: string; type: string; id: string; file?: File };
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  [property: string];
}

declare type NewImageItem = {
  id: string;
  media: { file: File; type: string; url: string };
  sequence: number;
};

declare type ExistingImageItem = {
  asset_id: string;
  id?: string;
  imageUrl: string;
  _id?: string;
};
