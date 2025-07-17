export const validateEmail = (email) => {
  const regex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export const addThousandsSeparator = (num) => {
  if (!num && num !== 0) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};