import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Theme } from "@radix-ui/themes";
import HyperText from "@/components/ui/hyper-text";
import RetroGrid from "@/components/ui/retro-grid";
import "./index.css";
import BoxReveal from "./components/ui/box-reveal";
import FileList from "./FileList";
import UploadFileButton from "./UploadFileButton";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };
  return (
    <Theme appearance={theme}>
      <RetroGrid />
      <Flex
        position="sticky"
        px="4"
        py="4"
        justify="end"
        align={"center"}
        className="dark:bg-[#0c0c0c] dark:[box-shadow:0px_4px_16px_0px_rgba(0,0,0,0.30)]"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <ConnectButton />
        </Box>
        {theme === "light" ? (
          <Moon
            className="w-6 h-6 mx-4 cursor-pointer  hover:opacity-50"
            onClick={toggleTheme}
          />
        ) : (
          <Sun
            className="w-6 h-6 mx-4 cursor-pointer  hover:opacity-50"
            onClick={toggleTheme}
          />
        )}
      </Flex>
      <Container py={"9"} className="my-10">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-9xl font-extrabold">
              <HyperText text="WalSafe"></HyperText>
            </p>
            <BoxReveal boxColor={"#99efe4"} duration={0.5}>
              <h2 className="mt-[.5rem] text-2xl font-bold">
                File Encryption Storage Powered by{" "}
                <span className="text-[#99efe4]">Walrus Protocol</span>
              </h2>
            </BoxReveal>
            <BoxReveal boxColor={"#99efe4"} duration={0.5}>
              <div className="mt-6">
                <p className="text-lg">
                  Your files, fully encrypted and securely stored.
                </p>
              </div>
            </BoxReveal>
            <BoxReveal boxColor={"#99efe4"} duration={0.5}>
              <UploadFileButton />
            </BoxReveal>
          </div>
          <div>
            <FileList />
          </div>
        </div>
      </Container>
    </Theme>
  );
}

export default App;
