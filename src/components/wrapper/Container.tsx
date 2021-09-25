import { useColorMode } from "@chakra-ui/color-mode";
import { Flex } from "@chakra-ui/layout";
import React, { ReactNode } from "react";

import CTA from "../header/CTA";

type ContainerProps = {
  children: ReactNode;
};

const Container = ({ children }: ContainerProps) => {
  const { colorMode } = useColorMode();

  const bgColor = { light: "white", dark: "dark" };

  const color = { light: "black", dark: "white" };
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      bg={bgColor[colorMode]}
      color={color[colorMode]}
    >
      <CTA />
      {children}
    </Flex>
  );
};

export default Container;
