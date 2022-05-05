import { Reading, Type } from "./types";

export const checkAndGetValue = (value: any): number | null => {
  return !isNaN(parseFloat(value)) && isFinite(value) ? value : null;
};

export const checkAndGetTs = (value: any): number | null => {
  try {
    const ts = Number(value);

    return isFinite(ts) && Math.floor(ts) === ts ? ts : null;
  } catch (e) {
    return null;
  }
};

export const checkAndGetType = (value: any): Type | null => {
  return Object.values(Type).includes(value) ? value : null;
};

export const genKey = (entry: string): string => {
  return Buffer.from(entry).toString("base64");
};

export const getDuplicateKeys = (
  database: Record<string, Reading>,
  readings: Record<string, Reading>
): string[] => {
  const readingKeys = Object.keys(readings);
  const databaseKeys = Object.keys(database);

  return readingKeys.filter((key) => databaseKeys.includes(key));
};
