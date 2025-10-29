export interface FolderTaggingInfo {
  folder_id: string;
  folder_path: string;
  tagging_percentage: number; // 0 - 100
  total_images: number;
  tagged_images: number;
  has_images: boolean;
}

export interface FolderTaggingStatusResponse {
  status: 'success' | 'error';
  data: FolderTaggingInfo[];
  total_folders: number;
  message?: string;
}
