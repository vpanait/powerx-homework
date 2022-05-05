import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import { addBulkReadings, getReadings } from "./database";
import { CustomError, Reading } from "./types";
import { handleError } from "./errorHandler";
import {
  genKey,
  checkAndGetValue,
  checkAndGetTs,
  checkAndGetType,
} from "./helpers";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app: Express = express();

app.use(helmet());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.post("/data", async (req: Request, res: Response, next: NextFunction) => {
  const data = req?.body;

  try {
    let hasInvalidData = false;
    const entries = data?.split(/\r?\n/);
    const records: Record<string, Reading> = {};

    entries.forEach((entry: string) => {
      const values = entry?.split(" ");
      const ts = checkAndGetTs(values[0]);
      const type = checkAndGetType(values[1]);
      const value = checkAndGetValue(values[2]);

      if (ts && type && value) {
        const dataEntry: Reading = { ts, type, value };

        records[genKey(entry)] = dataEntry;
      } else {
        hasInvalidData = true;
        return;
      }
    });

    if (hasInvalidData) {
      return res.json({ success: false });
    }

    const result = addBulkReadings(records);

    return res.json({ success: true, result });
  } catch (e: unknown) {
    if (typeof e === "string") {
      next(new CustomError(e));
    } else if (e instanceof Error) {
      next(new CustomError(e.message));
    }
  }
});

app.get("/data", async (req, res, next) => {
  const dateRegEx = /\d{4}-\d{2}-\d{2}/;
  const { from, to } = req?.query;

  try {
    if (typeof from !== "string" || typeof to !== "string") {
      next(new CustomError("from and/or to query params are not string", 400));
      return;
    }

    if (!from || !to) {
      next(new CustomError("from and/or to query params missing", 400));
      return;
    }

    if (!dateRegEx.test(from as string) || !dateRegEx.test(to as string)) {
      next(new CustomError("from and/or to query params are invalid", 400));
      return;
    }

    var fromTs = new Date(from as string).getTime() / 1000;
    var toTs = new Date(to as string).getTime() / 1000;
    if (fromTs > toTs) {
      next(new CustomError("from cannot be greater than to", 400));
      return;
    }

    const data = getReadings(fromTs, toTs);
    return res.json({ data });
  } catch (e: unknown) {
    if (typeof e === "string") {
      next(new CustomError(e));
    } else if (e instanceof Error) {
      next(new CustomError(e.message));
    }
  }
});

app.listen(PORT, () => console.log(`Running on port ${PORT} ⚡`));

app.use(handleError);

process.on("uncaughtException", function (err) {
  console.log("* uncaughtException err:", err);
});

process.on("unhandledRejection", function (err) {
  console.log("* unhandledRejection err:", err);
});
