import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import AppModal from "components/ui/modalDialog";
import React from "react";

import { User } from "./types";

type GenerateInoviceProps = {
  data: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const GenerateInvoice = ({
  data,
  isOpen,
  onClose,
  onSuccess,
}: GenerateInoviceProps) => {
  const header = <Text>Generate Invoice</Text>;
  const modalBody = (
    <Stack spacing={2}>
      <FormControl isRequired>
        <FormLabel>Customer's Name</FormLabel>
        <Input
          type="string"
          name="custName"
          placeholder="Customer name"
        ></Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Customer's Email</FormLabel>
        <Input
          type="string"
          name="custEmail"
          placeholder="Customer email"
        ></Input>
      </FormControl>
      <FormControl>
        <FormLabel>Notes</FormLabel>
        <Input type="string" name="notes" placeholder="Notes"></Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Item Data</FormLabel>
        <Flex gridGap={2}>
          <Input type="string" placeholder="Item's name" />
          <Input type="number" placeholder="Item's quantity" />
          <Input type="number" placeholder="Item's price" />
          <Input type="number" placeholder="Amount" />
        </Flex>
      </FormControl>
    </Stack>
  );
  const confirmButton = (
    <Flex marginLeft="auto" gridGap={2}>
      <Button variant="outline">Back</Button>
      <Button colorScheme="teal">Submit</Button>
    </Flex>
  );
  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      body={modalBody}
      header={header}
      withFooter
      confirmButton={confirmButton}
    />
  );
};

export default GenerateInvoice;
