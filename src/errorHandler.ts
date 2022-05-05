import { Response, NextFunction, Request } from "express";
import { CustomError } from "./types";

export const handleError = (
  err: TypeError | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError = err;

  if (!(err instanceof CustomError)) {
    customError = new CustomError("Error has occurred!");
  }

  res.status((customError as CustomError).status).send(customError);
};
