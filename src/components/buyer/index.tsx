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
import { formatDate } from "functions/helpers/formatDate";
import React, { useEffect, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useHistory } from "react-router";
import {
  useFirestore,
  useFirestoreCollectionData,
  useSigninCheck,
} from "reactfire";

import DetailInvoiceComponent from "./DetailInvoice";

const BuyerPage = () => {
  const isDesktopWidth = useDesktopWidthCheck();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useAppToast();
  const history = useHistory();
  const firestore = useFirestore();
  const firebaseAuth = getAuth();
  const { status: signInStatus, data: currentUser } = useSigninCheck();
  const [selectedInvoiceIndex, setSelectedInvoiceIndex] = useState<number>(0);
  const invoiceCollection = collection(firestore, "invoices");
  const invoiceQuery = query(invoiceCollection, orderBy("madeOn", "asc"));
  const { status: invoiceStatus, data: invoiceList } =
    useFirestoreCollectionData(invoiceQuery);
  const usersCollection = collection(firestore, "users");
  const usersQuery = query(usersCollection, orderBy("name", "asc"));
  const { data: users } = useFirestoreCollectionData(usersQuery);
  const usersData = users ?? [];
  const invoiceDataList = invoiceList ?? [];
  const selectedInvoiceForModal = invoiceDataList
    .map((invoice) => invoice)
    .flat()[selectedInvoiceIndex];

  const handleOpenModal = (selectedInvoiceIndexNum: number) => {
    setSelectedInvoiceIndex(selectedInvoiceIndexNum);
    onOpen();
  };

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
          return await deleteUser(currentUser?.user)
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

  if (invoiceStatus === "loading" && signInStatus === "loading") {
    return <Spinner />;
  }

  return (
    <Stack spacing={3}>
      <Text fontSize="lg">
        {currentUser?.user?.displayName
          ? `Hello, ${currentUser?.user.displayName}`
          : ""}
      </Text>
      <Box overflowX={isDesktopWidth ? "auto" : "scroll"}>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Invoice ID</Th>
              <Th>Customer / Buyer's Name</Th>
              <Th>Notes</Th>
              <Th>Made On</Th>
              <Th>Made By</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {invoiceDataList.map((invoice, index) => {
              return (
                invoice.customerEmail.includes(currentUser?.user?.email) && (
                  <Tr key={index}>
                    <Td>{invoice.invoiceId}</Td>
                    <Td>{invoice.customerName}</Td>
                    <Td>{invoice.notes}</Td>
                    <Td>{formatDate(invoice.madeOn)}</Td>
                    <Td>{invoice.madeBy}</Td>
                    <Td>
                      <Button onClick={() => handleOpenModal(index)}>
                        See Detail Invoice
                      </Button>
                    </Td>
                  </Tr>
                )
              );
            })}
            <DetailInvoiceComponent
              isOpen={isOpen}
              onClose={onClose}
              data={selectedInvoiceForModal?.invoiceContent}
            />
          </Tbody>
        </Table>
        {invoiceDataList?.length === 0 && (
          <Text align="center" marginY={2}>
            No Invoice here!
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

export default BuyerPage;
