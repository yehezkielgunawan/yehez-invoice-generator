import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { getAuth } from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import AppModal from "components/ui/modalDialog";
import { useAppToast } from "components/ui/useAppToast";
import { thousandSeparator } from "functions/helpers/ThousandSeparator";
import React, { useEffect, useState } from "react";
import { useFirestore } from "reactfire";

import { InvoiceDataList, User } from "../types";

type GenerateInoviceProps = {
  data: User;
  isOpen: boolean;
  onClose: () => void;
};

const GenerateInvoice = ({ data, isOpen, onClose }: GenerateInoviceProps) => {
  const firestore = useFirestore();
  const toast = useAppToast();
  const firebaseAuth = getAuth();
  const currentUser = firebaseAuth.currentUser;
  const [invoiceDatas, setInvoiceDatas] = useState<InvoiceDataList>([]);
  const [custName, setCustName] = useState<string>("");
  const [custEmail, setCustEmail] = useState<string>("");
  const [tempNotes, setTempNotes] = useState<string>("");
  const [tempItemName, setTempItemname] = useState<string>("");
  const [tempItemQty, setTempItemQty] = useState<number>(0);
  const [tempItemPrice, setTempItemPrice] = useState<number>(0);
  const [tempItemAmount, setTempItemAmount] = useState<number>(0);

  const handleCustNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    return setCustName(e.target.value);
  };
  const handleCustEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    return setCustEmail(e.target.value);
  };

  const handleItemNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    return setTempItemname(e.target.value);
  };
  const handleItemQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempItemQty(Number(e.target.value));
    setTempItemAmount(Number(e.target.value) * tempItemPrice);
  };
  const handleItemPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempItemPrice(Number(e.target.value));
    setTempItemAmount(Number(e.target.value) * tempItemQty);
  };

  const handleAddItem = () => {
    setInvoiceDatas([
      ...invoiceDatas,
      {
        itemName: tempItemName,
        quantity: tempItemQty,
        price: tempItemPrice,
        amount: tempItemAmount,
      },
    ]);
  };

  const handleModalClose = () => {
    setInvoiceDatas([]);
    setTempItemname("");
    setTempItemQty(0);
    setTempItemPrice(0);
    setTempItemAmount(0);
    onClose();
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    return setTempNotes(e.target.value);
  };

  const handleSubmitInvoice = async () => {
    await setDoc(
      doc(
        firestore,
        "invoices",
        `${data.name}_${Math.floor(Math.random() * 100 + 1)}`,
      ),
      {
        customerEmail: data.email,
        customerName: data.name,
        invoiceId: `invoice_${data.name}_${Math.floor(
          Math.random() * 100 + 1,
        )}`,
        notes: tempNotes.length > 0 ? tempNotes : "",
        madeOn: new Date().toUTCString(),
        invoiceContent: invoiceDatas,
        madeBy: currentUser?.displayName,
      },
    );
    toast({
      status: "success",
      title: `Successfully to generate invoice for ${data.name}`,
    });
    handleModalClose();
  };

  const header = <Text>Generate Invoice</Text>;
  const modalBody = (
    <Stack spacing={2}>
      <FormControl isRequired>
        <FormLabel>Customer's Name</FormLabel>
        <Input
          type="string"
          name="custName"
          placeholder="Customer name"
          defaultValue={data.name}
          onChange={handleCustNameChange}
        ></Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Customer's Email</FormLabel>
        <Input
          type="string"
          name="custEmail"
          placeholder="Customer email"
          defaultValue={data.email}
          onChange={handleCustEmailChange}
        ></Input>
      </FormControl>
      <FormControl>
        <FormLabel>Notes</FormLabel>
        <Input
          type="string"
          name="notes"
          onChange={handleNotesChange}
          placeholder="Notes"
        ></Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Item Data</FormLabel>
        <Flex gridGap={2} align="center">
          <Input
            type="string"
            placeholder="Item's name"
            onChange={handleItemNameChange}
          />
          <Input
            type="number"
            placeholder="Qty"
            onChange={handleItemQtyChange}
          />
          <Input
            type="number"
            placeholder="Price"
            onChange={handleItemPriceChange}
          />
          <Input
            type="number"
            placeholder="Amount"
            defaultValue={tempItemAmount > 0 ? tempItemAmount : ""}
          />
        </Flex>
        <Button
          colorScheme="blue"
          isDisabled={tempItemAmount < 1}
          onClick={() => handleAddItem()}
        >
          Add
        </Button>
        {invoiceDatas.length > 0 ? (
          <Box overflowX="scroll">
            <Table>
              <Thead>
                <Tr>
                  <Th>Item Name</Th>
                  <Th>Qty</Th>
                  <Th>Price (Rp)</Th>
                  <Th>Amount (Rp)</Th>
                </Tr>
              </Thead>
              <Tbody>
                {invoiceDatas.length > 0 &&
                  invoiceDatas.map((invoiceData, index) => (
                    <Tr key={index}>
                      <Td>{invoiceData.itemName}</Td>
                      <Td>{invoiceData.quantity}</Td>
                      <Td>{thousandSeparator(invoiceData.price)}</Td>
                      <Td>{thousandSeparator(invoiceData.amount)}</Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Text textAlign="center">No Item Data</Text>
        )}
      </FormControl>
    </Stack>
  );
  const confirmButton = (
    <Flex marginLeft="auto" gridGap={2}>
      <Button variant="outline" onClick={() => handleModalClose()}>
        Cancel
      </Button>
      <Button
        colorScheme="teal"
        isDisabled={
          invoiceDatas.length < 1 || custEmail.length < 5 || custName.length < 3
        }
        onClick={() => handleSubmitInvoice()}
      >
        Submit
      </Button>
    </Flex>
  );

  useEffect(() => {
    setInvoiceDatas([]);
    setCustEmail(data.email);
    setCustName(data.name);
  }, []);

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
