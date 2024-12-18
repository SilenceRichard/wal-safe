import ShimmerButton from "@/components/ui/shimmer-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { readBase64File } from "@/lib/base64";
import { uploadToWalrus } from "./lib/walrus";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import { FileItem, useStore } from "./store";
import { encryptData, generateAesKey } from "@/lib/encrypt";
import PasswordForm from "./components/password-form";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSignPersonalMessage,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Transaction } from "@mysten/sui/transactions";
import { File_TABLE_ID, PACKAGE_ID } from "./constants";
import { useFetchingFiles } from "./hooks/useFetchingFiles";

const UploadFileButton = () => {
  const account = useCurrentAccount();
  const { mutate: signPersonalMessage } = useSignPersonalMessage(); // 签名消息
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { startFetchingFiles } = useFetchingFiles();
  const suiClient = useSuiClient();
  const [password, setpassword] = useState("");
  const [isOpened, setIsOpened] = useState(false);
  const uploading = useStore((state) => state.uploading);
  const setUpload = useStore((state) => state.setUpload);
  const fileInputRef = useRef<any>(null);

  const handleFileChange = async (event: any) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      // 文件大小不能超过10MB
      if (file.size > 10 * 1024 * 1024) {
        toast.error("The file size should be less than 10MB");
        return;
      }
      setIsOpened(true);
      setUpload(true);
      const closeDialog = () => {
        setIsOpened(false);
        setpassword("");
      };
      const base64: string = await readBase64File(file);
      // 生成base64签名
      signPersonalMessage(
        {
          message: new TextEncoder().encode(base64),
        },
        {
          onError: (error) => {
            toast.error("Sign message failed");
            closeDialog();
            throw error;
          },
          onSuccess: async (result) => {
            try {
              // 加密文件 & 上传到walrus
              const aesKey = generateAesKey(password);
              const { encrypted, iv } = encryptData(base64, aesKey);
              closeDialog();
              const res = await uploadToWalrus({
                file_name: file.name,
                encrypted,
                ivBase64: iv,
                signature: result.signature,
              });
              setUpload(false);
              if (res.alreadyCertified) {
                toast.error("The file has been uploaded before.");
                return;
              }
              const { newlyCreated = {}, alreadyCertified = {} } = res;
              const blobId =
                newlyCreated.blobObject?.blobId || alreadyCertified.blobId;
              const fileInfo: FileItem = {
                file_name: file.name,
                blobId,
              };
              // 拿到加密数据和blobId后，调用合约存储数据
              const txb = new Transaction();
              txb.moveCall({
                target: `${PACKAGE_ID}::file_storage::upload_file`,
                arguments: [
                  // 传递给合约函数的参数
                  txb.object(File_TABLE_ID),
                  txb.pure.string(fileInfo.file_name),
                  txb.pure.string(blobId),
                  txb.pure.string(iv),
                  txb.pure.string(result.signature),
                ],
              });
              signAndExecuteTransaction(
                {
                  transaction: txb,
                },
                {
                  onError: (err) => {
                    console.error(err.message);
                    toast.error("Something went wrong");
                  },
                  onSuccess: async ({ digest }) => {
                      await suiClient.waitForTransaction({
                      digest: digest,
                      options: {
                        // showEvents: true,
                      },
                    });
                    toast.success("Upload successfully!");
                    startFetchingFiles();
                  },
                },
              );
            } catch (error) {
              toast.error("upload to Walrus failed");
              setUpload(false);
            }
          },
        },
      );
    } catch (error) {}
  };

  const handleButtonClick = () => {
    if (!password) {
      toast.error("Please input the secret of the file before upload.");
      return;
    }
    fileInputRef.current.click(); // 模拟点击隐藏的文件输入框
  };
  const handleDiologTriggle = () => {
    if (uploading) {
      return;
    }
    if (!account) {
      toast.error("Please connect your wallet first.");
      return;
    }
    setIsOpened(true);
  };
  return (
    <>
      <Dialog
        open={isOpened}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setpassword("");
          }
          setIsOpened(open);
        }}
      >
        <ShimmerButton className="my-16" onClick={handleDiologTriggle}>
          {uploading && <LoadingSpinner className="mr-1" />}
          <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
            {uploading ? "Uploading..." : "Upload Now"}
          </span>
        </ShimmerButton>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>File Secret</DialogTitle>
            <DialogDescription>
              <Alert
                variant="destructive"
                className="mt-2 border-red-500 text-red-500 text-lg"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Alert</AlertTitle>
                <AlertDescription>
                  Please keep the password secure, it is the only way to decrypt
                  the file
                </AlertDescription>
              </Alert>
            </DialogDescription>
          </DialogHeader>
          <PasswordForm
            parentPassword={password}
            setparentPassword={setpassword}
          />
          <DialogFooter>
            {/* 隐藏的文件输入框 */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept="image/*"
            />
            {/* 保留原 Button 样式 */}
            <Button
              type="submit"
              disabled={!password}
              onClick={handleButtonClick}
              className="bg-black text-[#fff]"
            >
              {uploading && <LoadingSpinner />}
              Upload File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadFileButton;
