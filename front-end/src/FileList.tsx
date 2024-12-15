"use client"

import { useState } from "react"
import { Plus, RepeatIcon, Download, Dock } from "lucide-react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

import List, { Item, ListItem } from "@/components/ui/file-list"
import NoData from "./components/ui/no-data"

const initialState = [
  {
    text: "Gather Data",
    checked: false,
    id: 1,
    description:
      "Collect relevant marketing copy from the user's website and competitor sites to understand the current market positioning and identify potential areas for improvement.",
  },
  {
    text: "Analyze Copy",
    checked: false,
    id: 2,
    description:
      "As an AI language model, analyze the collected marketing copy for clarity, persuasiveness, and alignment with the user's brand voice and target audience. Identify strengths, weaknesses, and opportunities for optimization.",
  },
  {
    text: "Create Suggestions",
    checked: false,
    id: 3,
    description:
      "Using natural language generation techniques, create alternative versions of the marketing copy that address the identified weaknesses and leverage the opportunities for improvement. Ensure the generated copy is compelling, on-brand, and optimized for the target audience.",
  },
  {
    text: "Recommendations",
    checked: false,
    id: 5,
    description:
      "Present the AI-generated marketing copy suggestions to the user, along with insights on why these changes were recommended. Provide a user-friendly interface for the user to review, edit, and implement the optimized copy on their website.",
  },
]

function ListDemo() {
  const [items, setItems] = useState<Item[]>(initialState)

  const handleAddItem = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        text: `Item ${prevItems.length + 1}`,
        checked: false,
        id: Date.now(),
        description: "",
      },
    ])
  }

  const handleResetItems = () => {
    setItems(initialState)
  }

  const renderListItem = (
    item: Item,
    order: number,
  ) => {

    return (
      <ListItem
        item={item}
        order={order}
        key={item.id}
        className="my-2 "
        renderExtra={(item) => (
          <div
            className={cn(
              "flex h-full w-full flex-col items-center justify-center gap-2 ",
              "py-3 "
            )}
          >
            <motion.button
              layout
              key="collapse"
              className={cn(
                "relative z-10 ml-auto mr-3 "
              )}
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
                <Download className="stroke-1 h-5 w-5 text-white/80  hover:stroke-[#13EEE3]/70 " />
              </motion.span>
            </motion.button>
          </div>
        )}
      />
    )
  }
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
                uploaded on <span className="text-[#13EEE3]"> @Walrus</span>
              </a>
            </div>
            <div className="flex items-center justify-between gap-4 py-2">
              <button disabled={items?.length > 5} onClick={handleAddItem}>
                <Plus className="dark:text-netural-100 h-5 w-5 text-neutral-500/80 hover:text-white/80" />
              </button>
              <div data-tip="Reset task list">
                <button onClick={handleResetItems}>
                  <RepeatIcon className="dark:text-netural-100 h-4 w-4 text-neutral-500/80 hover:text-white/80" />
                </button>
              </div>
            </div>
            {
              items.length ? <List
                items={items}
                renderItem={renderListItem}
              /> : <NoData />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListDemo;
