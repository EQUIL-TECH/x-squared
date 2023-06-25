import { ref, type Ref } from "vue";

export type AddressData = {
  address: string | null;
  name: string | null;
  accountType: string | null;
};

export type AddressDataMap = Map<string, AddressData>;

export const AddressDataMapRef: Ref<AddressDataMap> = ref(new Map());

const ADDRESS_DATA = "addressData";

export function getAddressData(): AddressDataMap {
  const addMap = localStorage.getItem(ADDRESS_DATA);
  if (addMap) {
    AddressDataMapRef.value = JSON.parse(addMap);
    return JSON.parse(addMap);
  }
  return new Map<string, AddressData>();
}

export function saveAddressData(addMap: AddressDataMap) {
  AddressDataMapRef.value = addMap;
  localStorage.setItem(ADDRESS_DATA, JSON.stringify(addMap));
}

export function addAddressData(
  address: string,
  name: string,
  accountType: string
) {
  const addMap = getAddressData();
  addMap.set(address, { address, name, accountType });
  saveAddressData(addMap);
  return addMap;
}
