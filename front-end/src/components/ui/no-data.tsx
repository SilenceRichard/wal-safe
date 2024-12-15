const NoData = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 text-gray-300 p-6">
      <div className="text-4xl font-bold mb-4">No Data</div>
      <div className="text-lg text-gray-400">Please Connect Wallet or upload a file</div>
    </div>
  );
};

export default NoData;