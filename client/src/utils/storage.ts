const get = (key: string) => sessionStorage.getItem(key);
const getAccessToken = (key: string): any | null => {
  const storedValue = get(key);
  return storedValue ? JSON.parse(storedValue) : null;
};

const set = (key: string, value: any) => sessionStorage.setItem(key, value);
const setAccessToken = (key: string, value: any) =>
  set(key, JSON.stringify(value));

export default { getAccessToken, setAccessToken };
