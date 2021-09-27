import { Button } from "@chakra-ui/button";
import {
  FormControl,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Stack, Text } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { Spinner } from "@chakra-ui/spinner";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { createUserWithEmailAndPassword, getAuth } from "@firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  setDoc,
} from "@firebase/firestore";
import { FirebaseError } from "@firebase/util";
import { useAppToast } from "components/ui/useAppToast";
import { useDesktopWidthCheck } from "functions/helpers/DesktopWidthChecker";
import React, { useState } from "react";
import { FaSignOutAlt, FaTrash } from "react-icons/fa";
import { useHistory } from "react-router";
import { useFirestore, useFirestoreCollectionData } from "reactfire";

const AdminPage = () => {
  const isDesktopWidth = useDesktopWidthCheck();
  const toast = useAppToast();
  const history = useHistory();
  const firestore = useFirestore();
  const firebaseAuth = getAuth();
  const usersCollection = collection(firestore, "users");
  const usersQuery = query(usersCollection, orderBy("name", "asc"));
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [name, setName] = useState<string>("");

  const { status, data: users } = useFirestoreCollectionData(usersQuery);

  if (status === "loading") {
    return <Spinner />;
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(String(e.target.value));
  };
  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (role) {
      return setEmail(`${role}_${e.target.value}`);
    }
    return;
  };
  const handlePasswordChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    return setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    return setConfirmPassword(e.target.value);
  };
  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    return setName(e.target.value);
  };

  const createNewUser = async () => {
    return await createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then(async () => {
        await setDoc(doc(firestore, "users", name), {
          name: name,
          email: email,
          password: password,
        });
        toast({
          status: "success",
          title: "Successfully add new user to DB Collection",
        });
      })
      .catch((error: FirebaseError) => {
        toast({
          status: "error",
          title: error.message,
        });
      });
  };

  const handleCreateNewUser = async () => {
    let isSameEntry = false;
    users.forEach((user) => {
      if (user.name === name || user.email === email) {
        isSameEntry = true;
      }
    });
    if (isSameEntry) {
      return toast({
        status: "warning",
        title: "There is a same name or email in the database",
        description: "Please change it before you create new user!",
      });
    }
    return createNewUser();
  };

  const handleDeleteUser = async (userName: string) => {
    await deleteDoc(doc(firestore, "users", userName));
    toast({
      status: "warning",
      title: "A data has been deleted!",
    });
  };

  const handleLogoutFirebase = () => {
    return firebaseAuth
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

  return (
    <Stack spacing={3}>
      <Stack spacing={2}>
        <Text fontSize="lg">
          <b>Create User</b>
        </Text>
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            name="name"
            type="string"
            placeholder="User display name"
            onChange={handleNameChange}
          />
          <FormHelperText>
            {name.length < 5 && "Name must be minimum 5 characters or more"}
          </FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Flex gridGap={2}>
            <Select
              name="role"
              placeholder="Select Role"
              onChange={handleSelectChange}
            >
              <option value="seller">Seller</option>
              <option value="buyer">Buyer</option>
            </Select>
            <Input
              name="email"
              placeholder="User email"
              type="email"
              onChange={handleEmailChange}
            />
          </Flex>
          <FormHelperText>{!role && "Please select the role!"}</FormHelperText>
          <FormHelperText>
            {role && email.length > 0 && `Your username will be ${email}`}
          </FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            placeholder="Input Password here"
            type="password"
            onChange={handlePasswordChange}
          />
          <Input
            placeholder="Confirm Password"
            type="password"
            onChange={handleConfirmPasswordChange}
            isInvalid={password !== confirmPassword}
          />
          <FormHelperText>
            The password must be minimum 5 characters or more.
          </FormHelperText>
          <FormHelperText>
            {password !== confirmPassword && "The password does not match."}
          </FormHelperText>
        </FormControl>
        <Button
          variant="outline"
          colorScheme="green"
          onClick={() => handleCreateNewUser()}
          isDisabled={
            !email ||
            !role ||
            name.length < 3 ||
            password.length < 5 ||
            password !== confirmPassword
          }
        >
          Create New User
        </Button>
      </Stack>
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
            {users.map((user, index) => (
              <Tr key={index}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <Button
                    variant="solid"
                    colorScheme="red"
                    leftIcon={<FaTrash />}
                    onClick={() => handleDeleteUser(user.name)}
                  >
                    Delete User
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
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

export default AdminPage;
