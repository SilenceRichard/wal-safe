import { create } from 'zustand';

export type FileItem = {
  fileName: string
  blobId: string
}

interface State {
  uploading: boolean;
  files: FileItem[];
}

interface Action {
  setUpload: (uploading: boolean) => void;
  setFiles: (files: FileItem[]) => void;
}

export const useStore = create<State & Action>((set) => ({
  uploading: false,
  files: [],
  setUpload: (uploading: boolean) => set({ uploading }),
  setFiles: (files: FileItem[]) => set({ files }),
}));