import { ReactNode } from "react"

import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { FileItem } from "./store"


interface ListItemProps {
  item: FileItem
  order: number
  renderExtra?: (item: FileItem) => React.ReactNode
  className?: string
}

function ListItem({
  item,
  order,
  renderExtra,
  className,
}: ListItemProps) {
  return (
    <div className={cn("", className)} key={item.blobId}>
      <div className="flex w-full items-center">
        <div
          className={cn(
            "relative z-auto grow",
            "h-full rounded-xl bg-[#161716]/80",
            "shadow-[0px_1px_0px_0px_hsla(0,0%,100%,.03)_inset,0px_0px_0px_1px_hsla(0,0%,100%,.03)_inset,0px_0px_0px_1px_rgba(0,0,0,.1),0px_2px_2px_0px_rgba(0,0,0,.1),0px_4px_4px_0px_rgba(0,0,0,.1),0px_8px_8px_0px_rgba(0,0,0,.1)]",
            "cursor-pointer"
          )}
        >
          <div className="flex items-center justify-center">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.001 }}
                className="flex items-center space-x-2 px-2"
              >
                <p className="font-mono mx-1 text-xs pl-1 text-white/50">
                  {order + 1}
                </p>
                <motion.div
                  className="px-1 min-w-[150px]"
                  initial={{
                    opacity: 0,
                    filter: "blur(4px)",
                  }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    bounce: 0.2,
                    type: "spring",
                  }}
                >
                  <h4
                    className={cn(
                      "tracking-tighter text-base md:text-lg",
                      "text-white/70"
                    )}
                  >
                    <span>{item.fileName}</span>
                  </h4>
                </motion.div>
              </motion.div>
            </AnimatePresence>
            {renderExtra && renderExtra(item)}
          </div>
        </div>
      </div>
    </div>
  )
}

ListItem.displayName = "ListItem"

interface ListProps {
  items: FileItem[]
  renderItem: (
    item: FileItem,
    order: number,
  ) => ReactNode
}

function List({ items, renderItem }: ListProps) {
  if (items) {
    return (
      <div className="flex flex-col">
        <AnimatePresence>
          {items?.map((item, index) =>
            renderItem(item, index)
          )}
        </AnimatePresence>
      </div>
    )
  }
  return null
}

List.displayName = "List"

export { List, ListItem };
export default List;