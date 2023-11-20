const get = (key: string) => localStorage.getItem(key) || '';
const getJSON = (key: string) => JSON.parse(get(key));

const set = (key: string, value: any) => localStorage.setItem(key, value);
const setJSON = (key: string, value: any) => set(key, JSON.stringify(value));

export default { getJSON, setJSON };
