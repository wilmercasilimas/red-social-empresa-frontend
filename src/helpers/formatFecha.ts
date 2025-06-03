export const formatFecha = (isoDate: string): string => {
  if (!isoDate.includes("T")) return "Fecha inválida";
  const [y, m, d] = isoDate.split("T")[0].split("-");
  return `${d}/${m}/${y}`;
};
