import { useColorMode } from "@chakra-ui/color-mode";
import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

import { useDesktopWidthCheck } from "../../functions/helpers/DesktopWidthChecker";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

const CTA = () => {
  const isDesktopWidth = useDesktopWidthCheck();
  const { colorMode } = useColorMode();
  return (
    <Box
      justifyContent="start"
      bg={colorMode === "light" ? "white" : "gray.700"}
      position="fixed"
      width="100%"
      opacity="0.95"
      top={0}
      zIndex={5}
    >
      <Flex
        justifyContent="space-between"
        py={2}
        align="center"
        maxW="48rem"
        mx="auto"
        px={isDesktopWidth ? 0 : 2}
      >
        <Text as="a" fontSize="md">
          <b>yehez-invoice-generator</b>
        </Text>
        <ColorModeSwitcher />
      </Flex>
    </Box>
  );
};

export default CTA;
