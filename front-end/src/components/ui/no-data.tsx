import { cn } from "@/lib/utils";

const NoData = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-[#111113] text-gray-300 p-6",
        className,
      )}
    >
      <div className="text-2xl font-bold mb-4">No Data</div>
      <div className="text-base text-gray-400">
        Please Connect Wallet and upload a file
      </div>
    </div>
  );
};

export default NoData;
