import { File_TABLE_ID } from "@/constants";
import { useStore } from "@/store";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { toast } from "sonner";

export const useFetchingFiles = () => {
  const account = useCurrentAccount();
  const fetchingFiles = useStore((state) => state.fetchingFiles);
  const setFetchingFiles = useStore((state) => state.setFetchingFiles);
  const setFiles = useStore((state) => state.setFiles);
  const suiClient = useSuiClient();
  const startFetchingFiles = () => {
    if (!account) {
      return;
    }
    setFetchingFiles(true);
    suiClient
      .getObject({
        id: File_TABLE_ID,
        options: {
          showBcs: true,
          showContent: true,
        },
      })
      .then((res) => {
        const { data } = res;
        const fieldsData: any = (data?.content as any)?.fields;
        if (!fieldsData) {
          return;
        }
        const userFileList = fieldsData.files
          .map((item: any) => item.fields)
          .filter((item: any) => item.uploader === account.address);
        setFiles(userFileList);
        setFetchingFiles(false);
      })
      .catch(() => {
        toast.error("Failed to fetch file list");
        setFetchingFiles(false);
      });
  }
  return {
    fetchingFiles,
    startFetchingFiles,
  };
};
