import { ChakraProvider, Skeleton, theme } from "@chakra-ui/react";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import Routings from "components/route/Routings";
import Container from "components/wrapper/Container";
import { Main } from "components/wrapper/Main";
import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider, FirestoreProvider, useFirebaseApp } from "reactfire";

export const App = () => {
  const firestoreInstance = getFirestore(useFirebaseApp());
  const auth = getAuth(useFirebaseApp());
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider sdk={auth}>
        <FirestoreProvider sdk={firestoreInstance}>
          <Router>
            <Container>
              <Main>
                <React.Suspense fallback={<Skeleton height="full" />}>
                  <Routings />
                </React.Suspense>
              </Main>
            </Container>
          </Router>
        </FirestoreProvider>
      </AuthProvider>
    </ChakraProvider>
  );
};
