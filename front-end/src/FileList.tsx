import { Download, Dock } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import List, { ListItem } from "./file-list";
import NoData from "./components/ui/no-data";
import { FileItem, useStore } from "./store";
import { downLoadBase64, parseBase64, parseBlobToJson } from "./lib/base64";
import { downLoadFromWalrus, FileInfo } from "./lib/walrus";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import PasswordForm from "./components/password-form";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { verifyPersonalMessageSignature } from "@mysten/sui/verify";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { toast } from "sonner";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import { File_TABLE_ID, PACKAGE_ID } from "./constants";
import { Transaction } from "@mysten/sui/transactions";

function FileList() {
  const account = useCurrentAccount();
  const items = useStore((state) => state.files);
  const downLoading = useStore((state) => state.downloading);
  const setdownLoading = useStore((state) => state.setDownload);
  const setFiles = useStore((state) => state.setFiles);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const [password, setPassword] = useState("");
  // 调用合约，读取table数据
  const readFileListFromContract = async () => {
    const txb = new Transaction();
    txb.moveCall({
      target: `${PACKAGE_ID}::file_storage::get_all_files_by_caller`,
      arguments: [
        // 传递给合约函数的参数
        txb.object(File_TABLE_ID),
      ],
    });

    // 使用 dApp Kit 提供的 React hook 来签名和执行交易
    signAndExecuteTransaction(
      {
        transaction: txb,
      },
      {
        onError: (err) => {
          console.error(err.message);
        },
        onSuccess: async ({ digest }) => {
          const { events } = await suiClient.waitForTransaction({
            digest: digest,
            options: {
              showEvents: true,
            },
          });
          // const parsedJson = events?.[0].parsedJson;
          if (events?.length) {
            const parsedJson: { files: FileItem[] } = events?.[0].parsedJson as unknown as { files: FileItem[] };
            const { files } = parsedJson;
            setFiles(files);
          }
          console.log("events", events?.[0].parsedJson);
        },
      },
    );
  };
  const renderListItem = (item: FileItem, order: number) => {
    const handleDownLoad = async () => {
      try {
        setdownLoading(true);
        const walrusStore = await downLoadFromWalrus(item.blobId);
        const resJson: FileInfo = await parseBlobToJson(walrusStore);
        const { file_name, signature } = resJson;
        const base64 = parseBase64(resJson, password);
        // 验证签名，确保文件未被篡改
        const message = new TextEncoder().encode(base64);
        const publicKey = await verifyPersonalMessageSignature(
          message,
          signature,
        );
        const suiAddress = publicKey.toSuiAddress();
        if (suiAddress !== account?.address) {
          throw new Error("Signature verification failed");
        }
        downLoadBase64(file_name, base64);
        toast.success("Download file successfully");
        setdownLoading(false);
      } catch (error) {
        setdownLoading(false);
        console.error("downLoadFromWalrus error", error);
      }
    };
    return (
      <ListItem
        item={item}
        order={order}
        key={item.blobId}
        className="my-2 "
        renderExtra={() => (
          <div
            className={cn(
              "flex h-full w-full flex-col items-center justify-center gap-2 ",
              "py-3 ",
            )}
          >
            <motion.button
              layout
              key="collapse"
              className={cn("relative z-10 ml-auto mr-3 ")}
            >
              <motion.span
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 1, filter: "blur(0px)" }}
                transition={{
                  type: "spring",
                  duration: 0.95,
                }}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <Download
                      className="stroke-1 h-5 w-5 text-white/80  hover:stroke-[#13EEE3]/70 "
                      onClick={() => {
                        setPassword("");
                      }}
                    />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Download File</DialogTitle>
                      <DialogDescription>
                        Input the file password to download
                      </DialogDescription>
                    </DialogHeader>
                    <PasswordForm
                      parentPassword={password}
                      setparentPassword={setPassword}
                    />
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="bg-black text-[#fff]"
                        disabled={!password}
                        onClick={handleDownLoad}
                      >
                        {downLoading && <LoadingSpinner />}
                        Download File
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </motion.span>
            </motion.button>
          </div>
        )}
      />
    );
  };
  useEffect(() => {
    if (account) {
      readFileListFromContract();
    }
  }, [account]);
  return (
    <div className="md:px-4 w-full max-w-xl ">
      <div className="mb-9 rounded-2xl  p-2 shadow-sm md:p-6 dark:bg-[#151515]/50 bg-black">
        <div className=" overflow-auto p-1  md:p-4">
          <div className="flex flex-col space-y-2">
            <div className="">
              <h3 className="text-neutral-200">
                <Dock className="text-[#fff] dark:text-[#1c2024] inline mr-2" />
                File List
              </h3>
              <a
                className="text-xs text-white/80"
                href="https://www.walrus.xyz/build-on-walrus"
                target="_blank"
                rel="noopener noreferrer"
              >
                files will be uploaded on{" "}
                <span className="text-[#13EEE3]"> @Walrus</span>
              </a>
            </div>

            {items.length ? (
              <List items={items} renderItem={renderListItem} />
            ) : (
              <NoData />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileList;
