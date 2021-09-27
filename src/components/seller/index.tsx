import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { deleteUser, getAuth, updateProfile } from "@firebase/auth";
import { collection, orderBy, query } from "@firebase/firestore";
import { FirebaseError } from "@firebase/util";
import { useAppToast } from "components/ui/useAppToast";
import { useDesktopWidthCheck } from "functions/helpers/DesktopWidthChecker";
import React, { useEffect, useState } from "react";
import { FaFileInvoice, FaSignOutAlt } from "react-icons/fa";
import { useHistory } from "react-router";
import {
  useFirestore,
  useFirestoreCollectionData,
  useSigninCheck,
} from "reactfire";

import GenerateInvoice from "./GenerateInvoice";

const SellerPage = () => {
  const isDesktopWidth = useDesktopWidthCheck();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUserIndex, setSelectedUserIndex] = useState<number>(0);
  const toast = useAppToast();
  const history = useHistory();
  const firebaseAuth = getAuth();
  const firestore = useFirestore();
  const { status: SignInStatus, data: currentUser } = useSigninCheck();
  const usersCollection = collection(firestore, "users");
  const usersQuery = query(usersCollection, orderBy("name", "asc"));
  const { status: userStatus, data: users } =
    useFirestoreCollectionData(usersQuery);
  const usersData = users ?? [];
  const selectedUserForModal = usersData.map((user) => user).flat()[
    selectedUserIndex
  ];

  const handleLogoutFirebase = async () => {
    return await firebaseAuth
      .signOut()
      .then(() => {
        toast({
          status: "success",
          title: "Successfully logout",
        });
        history.push("/");
      })
      .catch((error: FirebaseError) => {
        toast({
          status: "error",
          title: error.message,
        });
      });
  };

  const handleOpenModal = (selectedUserIndexNum: number) => {
    setSelectedUserIndex(selectedUserIndexNum);
    onOpen();
  };

  useEffect(() => {
    if (currentUser?.signedIn === true) {
      usersData.map(async (user) => {
        if (
          user.email === currentUser?.user.email &&
          !currentUser?.user.displayName
        ) {
          return await updateProfile(currentUser?.user, {
            displayName: user.name,
          })
            .then(() => {
              toast({
                status: "success",
                title: `Welcome ${user.name}`,
              });
            })
            .catch((error: FirebaseError) => {
              toast({
                status: "error",
                title: error.message,
              });
            });
        }
        if (
          !usersData.some((user) => user.email === currentUser?.user?.email)
        ) {
          deleteUser(currentUser?.user)
            .then(() => {
              toast({
                status: "warning",
                title: "Account has deleted before!",
              });
              return history.push("/");
            })
            .catch((error: FirebaseError) => {
              return toast({
                status: "error",
                title: error.message,
              });
            });
        }
      });
    }
  }, []);

  if (userStatus === "loading" && SignInStatus === "loading") {
    return <Spinner />;
  }

  return (
    <Stack spacing={3}>
      <Text fontSize="xl">
        {currentUser?.user?.displayName
          ? `Welcome ${currentUser?.user.displayName}!`
          : ``}
      </Text>
      <Text fontSize="lg">
        <b>Buyer List</b>
      </Text>
      <Box overflowX={isDesktopWidth ? "auto" : "scroll"}>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {usersData.map(
              (user, index) =>
                user.email.includes("buyer") && (
                  <Tr key={index}>
                    <Td>{user.name}</Td>
                    <Td>{user.email}</Td>
                    <Td>
                      <Button
                        variant="solid"
                        colorScheme="teal"
                        leftIcon={<FaFileInvoice />}
                        onClick={() => handleOpenModal(index)}
                      >
                        Generate Invoice
                      </Button>
                    </Td>
                  </Tr>
                ),
            )}
            <GenerateInvoice
              isOpen={isOpen}
              onClose={onClose}
              data={{
                name: selectedUserForModal?.name,
                email: selectedUserForModal?.email,
              }}
            />
          </Tbody>
        </Table>
        {usersData?.length === 0 && (
          <Text textAlign="center" my={2}>
            No user list for now.
          </Text>
        )}
      </Box>
      <Button
        colorScheme="orange"
        leftIcon={<FaSignOutAlt />}
        onClick={() => handleLogoutFirebase()}
      >
        LOGOUT
      </Button>
    </Stack>
  );
};

export default SellerPage;
