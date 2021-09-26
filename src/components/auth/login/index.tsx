import { Button } from "@chakra-ui/button";
import { FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Heading, Stack } from "@chakra-ui/layout";
import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import { FirebaseError } from "@firebase/util";
import { useAppToast } from "components/ui/useAppToast";
import React, { KeyboardEventHandler, useState } from "react";
import { useHistory } from "react-router";

const LoginPage = () => {
  const firebaseAuth = getAuth();
  const toast = useAppToast();
  const history = useHistory();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    return setEmail(e.target.value);
  };
  const handlePasswordChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    return setPassword(e.target.value);
  };
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (email.length > 6 && password.length > 3) {
      return signInWithEmailAndPassword(firebaseAuth, email, password)
        .then((userCredential) => {
          if (userCredential.user.email?.includes("admin")) {
            history.push("/admin");
          } else if (userCredential.user.email?.includes("seller")) {
            history.push("/seller");
          } else {
            history.push("/buyer");
          }
          toast({
            status: "success",
            title: "Login Successful",
            description: `Welcome ${userCredential.user.email}`,
          });
        })
        .catch((error: FirebaseError) => {
          toast({
            status: "error",
            title: error.code,
            description: error.message,
          });
        });
    }
    return toast({
      status: "warning",
      title: "Please fill the field with the proper value!",
    });
  };

  return (
    <Stack spacing={3}>
      <Heading as="h6">Login Page</Heading>
      <FormLabel>Email Address</FormLabel>
      <Input
        type="email"
        onChange={handleEmailChange}
        onKeyDown={handleKeyDown}
        isRequired
      />
      <FormLabel>Password</FormLabel>
      <Input
        type="password"
        onChange={handlePasswordChange}
        onKeyDown={handleKeyDown}
        isRequired
      />
      <Button
        onClick={() => handleSubmit()}
        variant="outline"
        colorScheme="teal"
      >
        Login
      </Button>
    </Stack>
  );
};

export default LoginPage;
