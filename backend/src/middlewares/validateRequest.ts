import { NextFunction, Request, Response } from "express";
import { z } from "zod";

type RequestValidationSchema = {
  body?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
};

export function validateRequest(schemas: RequestValidationSchema) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }

    if (schemas.params) {
      req.params = schemas.params.parse(req.params) as typeof req.params;
    }

    if (schemas.query) {
      req.query = schemas.query.parse(req.query) as typeof req.query;
    }

    return next();
  };
}