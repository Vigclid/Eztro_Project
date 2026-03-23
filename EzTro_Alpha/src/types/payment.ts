import { IInvoice } from "./invoice";

export interface IPayment {
  _id: string;
  createdAt: Date;
  invoice: IInvoice;
}
