import { create } from 'zustand';

interface ArchivedFilesStore {
  archivedFiles: number[];
  archiveFile: (fileId: number) => void;
  resetAll: () => void;
}

export const useArchivedFilesStore = create<ArchivedFilesStore>()(
  (set, get) => ({
    archivedFiles: [],
    
    // 파일 보관
    archiveFile: (fileId: number) => {
      const { archivedFiles } = get();
      if (!archivedFiles.includes(fileId)) {
        set({ archivedFiles: [...archivedFiles, fileId] });
      }
    },

    // 전체 리셋
    resetAll: () => {
      set({ archivedFiles: [] });
    },
  })
);
