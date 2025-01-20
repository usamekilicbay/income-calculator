import { onMounted, reactive, watch } from "vue";

export default function <T extends object>(initialValue: T, key: string) {
  const state = reactive(initialValue);

  onMounted(() => {
    const storageVal = window.localStorage.getItem(key);

    if (storageVal) {
      Object.assign(state, JSON.parse(storageVal));
    }
  });

  watch(
    () => state,
    (newVal) => {
      window.localStorage.setItem(key, JSON.stringify(newVal));
    },
    { deep: true }
  );

  return state;
}
