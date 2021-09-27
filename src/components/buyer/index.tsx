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
import { FaSignOutAlt } from "react-icons/fa";
import { useHistory } from "react-router";
import { useFirestore, useFirestoreCollectionData } from "reactfire";

import DetailInvoiceComponent from "./DetailInvoice";

const BuyerPage = () => {
  const isDesktopWidth = useDesktopWidthCheck();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useAppToast();
  const history = useHistory();
  const firestore = useFirestore();
  const firebaseAuth = getAuth();
  const [selectedInvoiceIndex, setSelectedInvoiceIndex] = useState<number>(0);
  const currentUser = firebaseAuth.currentUser;
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
    if (currentUser) {
      usersData.map(async (user) => {
        if (user.email === currentUser.email && !currentUser.displayName) {
          return await updateProfile(currentUser, { displayName: user.name })
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
      });
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      if (!usersData.some((user) => user.email === currentUser.email)) {
        deleteUser(currentUser)
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
    }
  }, []);

  if (invoiceStatus === "loading") {
    return <Spinner />;
  }

  return (
    <Stack spacing={3}>
      <Text fontSize="lg">
        {currentUser?.displayName ? `Hello, ${currentUser.displayName}` : ""}
      </Text>
      <Box overflowX={isDesktopWidth ? "auto" : "scroll"}>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Invoice ID</Th>
              <Th>Customer / Buyer's Name</Th>
              <Th>Notes</Th>
              <Th>Made On</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {invoiceDataList.map((invoice, index) => {
              return (
                invoice.customerEmail.includes(currentUser?.email) && (
                  <Tr key={index}>
                    <Td>{invoice.invoiceId}</Td>
                    <Td>{invoice.customerName}</Td>
                    <Td>{invoice.notes}</Td>
                    <Td>{invoice.madeOn}</Td>
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
