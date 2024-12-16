import ShimmerButton from "@/components/ui/shimmer-button";
import { Eye, EyeClosed } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import { useRef, useState } from "react";
import { readBase64File } from "@/lib/base64";
import { uploadToWalrus } from "./lib/walrus";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import { FileItem, useStore } from "./store";
import { encryptData, generateAesKey, ivToBase64 } from "@/lib/encrypt";
import PasswordForm from "./components/password-form";

const UploadFileButton = () => {
  const [password, setpassword] = useState("");
  const [passwordToggle, setpasswordToggle] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const uploading = useStore((state) => state.uploading);
  const setUpload = useStore((state) => state.setUpload);
  const files = useStore((state) => state.files);
  const setFileList = useStore((state) => state.setFiles);
  const fileInputRef = useRef<any>(null);
  const handleToggle = () => {
    setpasswordToggle(!passwordToggle);
  };
  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (!file) {
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
    // 加密文件
    const aesKey = generateAesKey(password);
    const { encrypted, iv } = encryptData(base64, aesKey);
    const res = await uploadToWalrus(file, {
      fileName: file.name,
      encrypted,
      ivBase64: iv,
    });
    // TODO: 暂时去掉重复文件校验
    // if (res.alreadyCertified) {
    //   closeDialog();
    //   toast.error("The file has been uploaded before.");
    //   return;
    // }
    const { newlyCreated = {}, alreadyCertified = {} } = res;
    // if (!newlyCreated.blobObject) {
    //   closeDialog();
    //   toast.error("Upload failed, please try again.");
    //   return;
    // }
    // TODO: 暂时去掉重复文件校验
    const blobId = newlyCreated.blobObject?.blobId || alreadyCertified.blobId;
    const fileInfo: FileItem = {
      fileName: file.name,
      blobId,
    };
    setFileList([...files, fileInfo]);
    closeDialog();
    toast.success("Upload successfully!");
  };

  const handleButtonClick = () => {
    if (!password) {
      toast.error("Please input the secret of the file before upload.");
      return;
    }
    fileInputRef.current.click(); // 模拟点击隐藏的文件输入框
  };
  return (
    <>
      <Dialog open={isOpened} onOpenChange={setIsOpened}>
        <DialogTrigger asChild>
          <ShimmerButton className="shadow-2xl my-16">
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              Upload Now
            </span>
          </ShimmerButton>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>File Secret</DialogTitle>
            <DialogDescription>
              Please input the secret of the file before upload.
              <div>
                <b>Remember to keep your password!</b>
              </div>
            </DialogDescription>
          </DialogHeader>
          <PasswordForm parentPassword={password} setparentPassword={setpassword} />
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
