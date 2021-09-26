import { Button } from "@chakra-ui/button";
import { Stack } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { collection, orderBy, query } from "@firebase/firestore";
import React from "react";
import { FaTrash } from "react-icons/fa";
import { useFirestore, useFirestoreCollectionData } from "reactfire";

const AdminPage = () => {
  const firestore = useFirestore();
  const usersCollection = collection(firestore, "users");
  const usersQuery = query(usersCollection, orderBy("name", "asc"));

  const { status, data: users } = useFirestoreCollectionData(usersQuery);

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <Stack spacing={3}>
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user, index) => (
            <Tr key={index}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>
                <Button
                  variant="solid"
                  colorScheme="red"
                  leftIcon={<FaTrash />}
                >
                  Delete User
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Stack>
  );
};

export default AdminPage;
