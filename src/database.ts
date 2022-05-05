import { Reading } from "./types";
import { getDuplicateKeys } from "./helpers";

let database: Record<string, Reading> = {};

/**
 * Store multiple readings in the database
 */
export const addBulkReadings = (
  readings: Record<string, Reading>
): Record<string, Reading> => {
  // To be decided if overwrite or ignore duplicates / I went for option 1
  const duplicates = getDuplicateKeys(database, readings);
  if (duplicates.length) {
    console.warn(">> batch has the following duplicate keys:", duplicates);
  }

  database = { ...database, ...readings };

  return readings;
};

/**
 * Retrieve a reading from the database using the given key
 */
export const getReadings = (
  fromTs: number,
  toTs: number
): Reading[] | undefined => {
  const databaseEntries = Object.values(database);
  return databaseEntries?.filter(
    (entry) => fromTs <= entry.ts && toTs >= entry.ts
  );
};
