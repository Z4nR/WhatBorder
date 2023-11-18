const get = (key: string) => localStorage.getItem(key);
const getAccessToken = (key: any) => {
  const storedValue = get(key);
  return storedValue ? JSON.parse(storedValue) : null;
};

const set = (key: string, value: any) => localStorage.setItem(key, value);
const setAccessToken = (key: string, value: any) =>
  set(key, JSON.stringify(value));

const remove = (key: string) => localStorage.removeItem(key);
const removeAccessToken = (key: any) => remove(key);

export default { getAccessToken, setAccessToken, removeAccessToken };
