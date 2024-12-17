import { create } from 'zustand';

export type FileItem = {
  file_name: string
  blobId: string
}

interface State {
  uploading: boolean;
  downloading: boolean;
  files: FileItem[];
}

interface Action {
  setUpload: (uploading: boolean) => void;
  setFiles: (files: FileItem[]) => void;
  setDownload: (downloading: boolean) => void;
}

export const useStore = create<State & Action>((set) => ({
  uploading: false,
  downloading: false,
  files: [],
  setUpload: (uploading: boolean) => set({ uploading }),
  setFiles: (files: FileItem[]) => set({ files }),
  setDownload: (downloading: boolean) => set({ downloading }),
}));