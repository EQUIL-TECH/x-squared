import { ref, type Ref } from "vue";

export function getDarkModeSetting(): boolean {
  const dark = localStorage.getItem("darkMode");
  return dark ? JSON.parse(dark) : false;
}

export const darkMode: Ref<boolean> = ref(getDarkModeSetting());

export function saveDarkModeSetting() {
  localStorage.setItem("darkMode", JSON.stringify(darkMode.value));
  darkMode.value = getDarkModeSetting();
}
