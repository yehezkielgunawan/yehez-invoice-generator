import { Stack } from "@chakra-ui/layout";
import React from "react";
import { ReactNode } from "react";

type MainProps = {
  children: ReactNode;
};

export const Main = ({ children }: MainProps) => (
  <Stack width="100%" maxWidth="48rem" pt="4rem" px={2} mt={8} spacing={4}>
    {children}
  </Stack>
);
