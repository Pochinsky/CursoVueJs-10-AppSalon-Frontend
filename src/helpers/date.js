import { parse, formatISO } from "date-fns";

export const convertToISO = (strDate) => {
  const newDate = parse(strDate, "dd/MM/yyyy", new Date());
  return formatISO(newDate);
};
