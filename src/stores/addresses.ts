import { ref, type Ref } from "vue";

export type AddressData = {
  address: string;
  name: string;
  accountType: string;
  owned: boolean;
};

export type AddressDataMap = Map<string, AddressData>;

export const AddressDataMapRef: Ref<AddressDataMap> = ref(new Map());

const ADDRESS_DATA = "addressData";

export function getAddressData(): AddressDataMap {
  const addMap = localStorage.getItem(ADDRESS_DATA);
  if (addMap) {
    const parsedData: { [key: string]: AddressData } = JSON.parse(addMap);
    const reconstructedMap: AddressDataMap = new Map(
      Object.entries(parsedData)
    );
    AddressDataMapRef.value = reconstructedMap;
    return reconstructedMap;
  }
  return new Map<string, AddressData>();
}

export function saveAddressData(addMap: AddressDataMap) {
  const obj: { [key: string]: AddressData } = Object.fromEntries(addMap);
  AddressDataMapRef.value = addMap;
  localStorage.setItem(ADDRESS_DATA, JSON.stringify(obj));
}

export function addAddressData(
  address: string,
  name: string,
  accountType: string,
  owned: boolean
) {
  const addMap = getAddressData();
  addMap.set(address, { address, name, accountType, owned });
  saveAddressData(addMap);
  return addMap;
}
