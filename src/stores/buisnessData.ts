export type BusinessData = {
  busName: string | null;
  busAddress: string | null;
  busNum: string | null;
  busLogo: string | null;
};

export function getBusinessData(): BusinessData | null {
  const ud = localStorage.getItem("businessData");
  if (ud) {
    return JSON.parse(ud);
  }
  return null;
}

export function saveBusinessData(ud: BusinessData | null) {
  localStorage.setItem("businessData", JSON.stringify(ud));
}
