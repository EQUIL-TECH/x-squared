import axios from "axios";

export function formatDate(dateString: string): string {
  //20/03/2023, 11:27:31 am
  const date = dateString.split(",")[0];
  const day = date.split("/")[0];
  const month = date.split("/")[1];
  const year = date.split("/")[2];
  return `${day}-${month}-${year}`;
}
export async function fetchConversionRate(crypto: string): Promise<number> {
  const response = await axios.get(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cripple&vs_currencies=aud"
  );
  const exchangeRates = response.data;
  return exchangeRates[crypto]["aud"];
}

export enum Fiat {
  AUD = "AUD",
  USD = "USD",
  nothing = "",
}

export enum Crypto {
  Bitcoin = "Bitcoin",
  Ethereum = "Ethereum",
  Ripple = "Ripple",
  nothing = "",
}

export async function getHistoricalCryptoPrice(
  date: string,
  crypto: Crypto = Crypto.Ripple,
  fiat: Fiat = Fiat.AUD
): Promise<number | null> {
  const lowerCrypto = crypto.toLowerCase();
  const url = `https://api.coingecko.com/api/v3/coins/${lowerCrypto}/history?date=${date}&localization=false`;

  console.log("url", url);

  const response = await fetch(url);

  if (response.ok) {
    const data = await response.json();
    console.log("data", data);
    if (fiat === Fiat.AUD) {
      return data.market_data.current_price.aud;
    } else if (fiat === Fiat.USD) {
      return data.market_data.current_price.usd;
    } else {
      return null;
    }
  } else {
    console.error(`Error: ${response.status}`);
    return null;
  }
}

export async function getCurrentRipplePriceInAUD(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=AUD"
    );
    const data = await response.json();
    return data.ripple.aud;
  } catch (error) {
    console.error("Error:", error);
    return 0;
  }
}
