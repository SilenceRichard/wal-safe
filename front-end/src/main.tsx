import React from "react";
import ReactDOMClient from "react-dom/client";
import ReactDOM from 'react-dom'; // 确保从 react-dom 导入

import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { networkConfig } from "./networkConfig.ts";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

ReactDOMClient.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
            {/* 将 Toaster 渲染到 body 中 */}
            {ReactDOM.createPortal(
            <Toaster
              toastOptions={{
                className: "z-50",
              }}
            />,
            document.body
          )}
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
