import { Button } from "@chakra-ui/button";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { collection, orderBy, query } from "@firebase/firestore";
import { useDesktopWidthCheck } from "functions/helpers/DesktopWidthChecker";
import React from "react";
import { FaFileInvoice } from "react-icons/fa";
import { useFirestore, useFirestoreCollectionData } from "reactfire";

const SellerPage = () => {
  const isDesktopWidth = useDesktopWidthCheck();
  const firestore = useFirestore();
  const usersCollection = collection(firestore, "users");
  const usersQuery = query(usersCollection, orderBy("name", "asc"));
  const { status, data: users } = useFirestoreCollectionData(usersQuery);

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <Stack spacing={3}>
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
            {users.map(
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
                      >
                        Generate Invoice
                      </Button>
                    </Td>
                  </Tr>
                ),
            )}
          </Tbody>
        </Table>
      </Box>
    </Stack>
  );
};

export default SellerPage;
