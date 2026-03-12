export const vietNameDateNow = (): Date => {
  const now = new Date();
  now.setHours(now.getHours() + 7);
  return now;
};
export const toLocalPhone = (phone: string) => {
  if (phone.startsWith("84")) {
    return "0" + phone.slice(2);
  }
  return phone;
};
