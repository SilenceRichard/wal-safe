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
import { useCurrentAccount, useSignPersonalMessage } from "@mysten/dapp-kit";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { AlertCircle } from "lucide-react";

const UploadFileButton = () => {
  const account = useCurrentAccount();
  const { mutate: signPersonalMessage } = useSignPersonalMessage(); // 签名消息
  const [password, setpassword] = useState("");
  const [isOpened, setIsOpened] = useState(false);
  const uploading = useStore((state) => state.uploading);
  const setUpload = useStore((state) => state.setUpload);
  const files = useStore((state) => state.files);
  const setFileList = useStore((state) => state.setFiles);
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
        setUpload(false);
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
              const res = await uploadToWalrus({
                fileName: file.name,
                encrypted,
                ivBase64: iv,
                signature: result.signature,
              });
              if (res.alreadyCertified) {
                closeDialog();
                toast.error("The file has been uploaded before.");
                return;
              }
              const { newlyCreated = {}, alreadyCertified = {} } = res;
              const blobId =
                newlyCreated.blobObject?.blobId || alreadyCertified.blobId;
              const fileInfo: FileItem = {
                fileName: file.name,
                blobId,
              };
              setFileList([...files, fileInfo]);
              closeDialog();
              toast.success("Upload successfully!");
            } catch (error) {
              toast.error("upload to Walrus failed");
              setUpload(false);
            }
          },
        },
      );
    } catch (error) {

    }
   
  };

  const handleButtonClick = () => {
    if (!password) {
      toast.error("Please input the secret of the file before upload.");
      return;
    }
    fileInputRef.current.click(); // 模拟点击隐藏的文件输入框
  };
  const handleDiologTriggle = () => {
    if (!account) {
      toast.error("Please connect your wallet first.");
      return;
    }
    setIsOpened(true);
  };
  return (
    <>
      <Dialog open={isOpened} onOpenChange={(open: boolean) => {
        if (uploading) {
          return;
        }
        if (!open) {
          setpassword("");
        }
        setIsOpened(open);
      }}>
        <ShimmerButton className="my-16" onClick={handleDiologTriggle}>
          <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
            Upload Now
          </span>
        </ShimmerButton>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>File Secret</DialogTitle>
            <DialogDescription>
              <Alert
                variant="destructive"
                className="mt-2 border-red-600 text-red-600"
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
