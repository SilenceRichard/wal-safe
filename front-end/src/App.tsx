import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex } from "@radix-ui/themes";
import HyperText from "@/components/ui/hyper-text";
import "./index.css";
import BoxReveal from "./components/ui/box-reveal";
import FileList from "./FileList";
import UploadFileButton from "./UploadFileButton";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster />
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="end"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <ConnectButton />
        </Box>
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
    </>
  );
}

export default App;
