import {
  Button,
  ChakraProvider,
  Heading,
  useColorMode
} from "@chakra-ui/react";
import * as React from "react";
import { render } from "react-dom";
import "./styles.css";
import { RichTextBlock } from "./components/RichTextBlock";

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Heading>Welcome to Chakra + TS + Slate.js</Heading>

      <Button onClick={toggleColorMode}>Current Mode: {colorMode}</Button>
      <RichTextBlock />
    </>
  );
}

const rootElement = document.getElementById("root");
render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
  rootElement
);
