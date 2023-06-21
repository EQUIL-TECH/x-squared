export enum accType {
  Exchange = "Exchange(AUD)",
  Client = "Client or Customer",
  Goods = "Goods or Services",
  Owned = "Personal Account",
}
export const accountTypes: accType[] = [
  accType.Exchange,
  accType.Client,
  accType.Goods,
  accType.Owned,
];

export const depositWithDrawlTypes = [accType.Exchange, accType.Owned];
export const incomingsOutgoingsTypes = [accType.Client, accType.Goods];
