import { onMounted, Ref, ref, watch } from "vue";

export default function <T>(initialValue: T, key: string): Ref<T> {
  const val = ref(initialValue) as Ref<T>;

  onMounted(() => {
    const storageVal = window.localStorage.getItem(key);

    if (storageVal) {
      val.value = JSON.parse(storageVal);
    }
  });

  watch(
    val,
    (newVal) => {
      window.localStorage.setItem(key, JSON.stringify(newVal));
    },
    { deep: true }
  );

  return val;
}
