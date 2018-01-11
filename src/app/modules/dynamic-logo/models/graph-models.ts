import { ColorEnum } from "../dynamic-logo/dynamic-logo.component";

export const contractAddress: string = '0x491559dd3DfdBCA13EDc74569e86c8A0D517975b';

/**
 * A node on that has made a transaction
 */
export class Wallet {
  id: string;
  transactions: Array<Transaction>;
  color: ColorEnum;

  constructor(id: string, color: ColorEnum) {
    this.id = id;
    this.color = color;
    this.transactions = new Array<Transaction>();
  }
}

/**
 * The connection between nodes
 */
export class Transaction {
  blockNumber: number;
  hash: string;
  isError: boolean;
  timeStamp: Date;
  source: Wallet;
  target: Wallet;
  value: number;
  txreceipt_status: number;

  constructor(blockNumber: number, hash: string, isError: boolean, timestamp: Date, from: Wallet, to: Wallet, value: number, receipt: number) {
    this.blockNumber = blockNumber;
    this.hash = hash;
    this.isError = isError;
    this.timeStamp = new Date();
    this.target = to;
    this.source = from;
    this.value = value;
    this.txreceipt_status = receipt;
  }
}

/**
 * The connection between nodes
 */
export class TransactionViewModel {
  blockNumber: number;
  hash: string;
  isError: boolean;
  timeStamp: Date;
  from: string;
  to: string;
  value: number;
  txreceipt_status: number;
}

