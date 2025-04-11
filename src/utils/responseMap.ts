import { AnyType } from "@/types/common.types";
import { Response } from "express";

export const success = (
  res: Response,
  data: AnyType,
  message: string,
  statusCode: number = 200
) => {
  res.status(statusCode).json({
    message,
    data,
    success: true,
  });
};

export const error = (res: Response, error: any, statusCode: number = 400) => {
  console.log(error);
  res.status(statusCode).json({
    success: false,
    error,
    data: null,
  });
};
