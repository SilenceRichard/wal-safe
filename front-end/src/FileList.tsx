import { Download, Dock } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import List, { ListItem } from "./file-list";
import NoData from "./components/ui/no-data";
import { FileItem, useStore } from "./store";
import { parseBase64AndDownload, parseBlobToJson } from "./lib/base64";
import { downLoadFromWalrus } from "./lib/walrus";

function FileList() {
  const items = useStore((state) => state.files);
  const renderListItem = (item: FileItem, order: number) => {
    const handleDownLoad = async () => {
      try {
        const walrusStore = await downLoadFromWalrus(item.blobId);
        const resJson = await parseBlobToJson(walrusStore)
        parseBase64AndDownload(item.fileName, resJson.content);
      } catch (error) {
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
                <Download
                  className="stroke-1 h-5 w-5 text-white/80  hover:stroke-[#13EEE3]/70 "
                  onClick={handleDownLoad}
                />
              </motion.span>
            </motion.button>
          </div>
        )}
      />
    );
  };
  return (
    <div className="md:px-4 w-full max-w-xl ">
      <div className="mb-9 rounded-2xl  p-2 shadow-sm md:p-6 dark:bg-[#151515]/50 bg-black">
        <div className=" overflow-auto p-1  md:p-4">
          <div className="flex flex-col space-y-2">
            <div className="">
              <Dock />
              <h3 className="text-neutral-200">File List</h3>
              <a
                className="text-xs text-white/80"
                href="https://www.uilabs.dev/"
                target="_blank"
                rel="noopener noreferrer"
              >
                files will uploaded on{" "}
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
