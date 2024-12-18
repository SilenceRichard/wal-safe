import { create } from 'zustand';

export type FileItem = {
  file_name: string
  blobId: string
}

interface State {
  uploading: boolean;
  downloading: boolean;
  files: FileItem[];
  fetchingFiles: boolean;
}

interface Action {
  setUpload: (uploading: boolean) => void;
  setFiles: (files: FileItem[]) => void;
  setDownload: (downloading: boolean) => void;
  setFetchingFiles: (fetchingFiles: boolean) => void;
}

export const useStore = create<State & Action>((set) => ({
  uploading: false,
  downloading: false,
  fetchingFiles: false,
  files: [],
  setFetchingFiles: (fetchingFiles: boolean) => set({ fetchingFiles }),
  setUpload: (uploading: boolean) => set({ uploading }),
  setFiles: (files: FileItem[]) => set({ files }),
  setDownload: (downloading: boolean) => set({ downloading }),
}));