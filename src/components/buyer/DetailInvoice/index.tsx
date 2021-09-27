import { Button } from "@chakra-ui/button";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { InvoiceDataList } from "components/seller/types";
import AppModal from "components/ui/modalDialog";
import React from "react";

type DetailInvoiceProps = {
  data: InvoiceDataList;
  isOpen: boolean;
  onClose: () => void;
};

const DetailInvoiceComponent = ({
  data,
  isOpen,
  onClose,
}: DetailInvoiceProps) => {
  const header = <Text>Detail Invoice</Text>;
  const modalBody = (
    <Box overflowX="scroll">
      <Table>
        <Thead>
          <Tr>
            <Th>Item Name</Th>
            <Th>Qty</Th>
            <Th>Price</Th>
            <Th>Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.length > 0 &&
            data.map((invoiceData, index) => (
              <Tr key={index}>
                <Td>{invoiceData.itemName}</Td>
                <Td>{invoiceData.quantity}</Td>
                <Td>{invoiceData.price}</Td>
                <Td>{invoiceData.amount}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </Box>
  );

  const confirmButton = (
    <Flex marginLeft="auto" gridGap={2}>
      <Button variant="outline" onClick={() => onClose()}>
        Close
      </Button>
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

export default DetailInvoiceComponent;
