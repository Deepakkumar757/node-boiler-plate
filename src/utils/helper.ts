import { BaseEntity, ILike, SelectQueryBuilder } from "typeorm";
import jwt from "jsonwebtoken";
import { AnyObject, AnyType } from "@/types/common.types";
import config from "@/configs";
import ShortUniqueId from "short-unique-id";

export const generateAutoId = (
  previousId: string,
  type: "request" | "task"
) => {
  const prefix = config.AutoIdPrefix[type];
  if (!previousId) return `${prefix}0001`;
  const incrementedNumber = parseInt(previousId.slice(prefix.length), 10) + 1;
  return `${prefix}${incrementedNumber
    .toString()
    .padStart(previousId.length - prefix.length, "0")}`;
};

export const getPagination = (data: { page: number; limit: number }) => {
  const skip = (data.page - 1) * data.limit;
  return { skip, take: data.limit };
};

interface genSearchClauseParams {
  searchValue: string;
  searchColumns: string[];
}

export const genSearchClause = (
  params: genSearchClauseParams,
  query: SelectQueryBuilder<any & BaseEntity>
) => {
  const { searchColumns, searchValue } = params;
  const value = ILike(`%${searchValue.toLowerCase()}%`);
  query.where((q) => {
    for (const column of searchColumns) {
      q.orWhere({ [column]: value });
    }
  });
  return query;
};

const columnCheckRegexp = /[a-z][A-Z]/;

export const convertStrIntoValidColNames = (
  columns: string[],
  alias: string
) => {
  return columns.map((col) => {
    if (col === "*") return `${alias}.${col}`;
    return columnCheckRegexp.test(col)
      ? `${alias}."${col}" as "${col}"`
      : `${alias}.${col} as "${col}"`;
  });
};

export const convertStrIntoValidColNamesNormal = (
  columns: string[],
  alias: string
) => {
  return columns.map((col) => {
    return `${alias}.${col}`;
  });
};

export const generateShortUUID = (length = 10): string => {
  const { randomUUID } = new ShortUniqueId({
    length: length,
    dictionary: "alphanum",
  });
  return randomUUID();
};

export const convertArrayIntoLabelValue = (data: string[]) => {
  return data.length > 0
    ? data.map((val) => ({ label: val, value: val }))
    : null;
};
/**
 * @description Merge two incharge Input while drafted task appears
 * @param obj1
 * @param obj2
 * @returns
 */
export const mergeNodeFormData = (obj1: AnyType, obj2: AnyType): AnyType => {
  try {
    if (obj1 === null) return obj2;
    if (obj2 === null) return obj1;

    const num1 = !isNaN(Number(obj1)) ? Number(obj1) : null;
    const num2 = !isNaN(Number(obj2)) ? Number(obj2) : null;

    if (num1 !== null && num2 !== null) {
      return num1 + num2;
    }

    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      return [...obj1, ...obj2];
    }

    if (typeof obj1 === "string" && typeof obj2 === "string") {
      return obj2;
    }

    if (typeof obj1 === "object" && typeof obj2 === "object") {
      const merged: any = { ...obj1 };

      for (const key in obj2) {
        merged[key] = merged.hasOwnProperty(key)
          ? mergeNodeFormData(merged[key], obj2[key])
          : obj2[key];
      }

      return merged;
    }

    return obj2;
  } catch (error) {
    console.log("Error in mergeInchargeData", error);
    return obj2;
  }
};

export const generateToken = (data: AnyObject) => {
  return jwt.sign(data, config.jwt.ACCESS_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (data: AnyObject) => {
  return jwt.sign(data, config.jwt.REFRESH_SECRET, { expiresIn: "2h" });
};
