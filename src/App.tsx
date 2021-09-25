import { ChakraProvider, Skeleton, theme } from "@chakra-ui/react";
import Routings from "components/route/Routings";
import Container from "components/wrapper/Container";
import { Main } from "components/wrapper/Main";
import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Router>
      <Container>
        <Main>
          <React.Suspense fallback={<Skeleton height="full" />}>
            <Routings />
          </React.Suspense>
        </Main>
      </Container>
    </Router>
  </ChakraProvider>
);
