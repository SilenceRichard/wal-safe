import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Button, Container, Flex, Heading } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import HyperText from "@/components/ui/hyper-text";
import "./index.css";
import BoxReveal from "./components/ui/box-reveal";
import ShimmerButton from "./components/ui/shimmer-button";

function App() {
  return (
    <>
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
          <ShimmerButton className="shadow-2xl my-16">
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              Upload Now
            </span>
          </ShimmerButton>
        </BoxReveal>
      </Container>
    </>
  );
}

export default App;
