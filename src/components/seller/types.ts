export type User = {
  name: string;
  email: string;
};

export type SingleItem = {
  customerEmail: string;
  customerName: string;
  invoiceId: string;
  madeOn: string;
  notes?: string;
  invoiceContent: Array<SingleInvoiceData>;
};

export type SingleInvoiceData = {
  quantity: number;
  amount: number;
  price: number;
  itemName: string;
};

export type InvoiceDataList = Array<SingleInvoiceData>;

export type Items = Array<SingleItem>;
