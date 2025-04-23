import { ObjectLiteral } from 'typeorm';

export type TcolumnWithAlias = <T extends ObjectLiteral>(
  columns: Array<keyof T>,
  aliasMap: Partial<Record<keyof T, string>>,
  tableAlias: string
) => string[];

export const columnsWithAliases: TcolumnWithAlias = (columns, aliasMap = {}, tableAlias = 'process') => {
  return columns.map((col) =>
    aliasMap[col]
      ? `${tableAlias}.${String(col)} as "${aliasMap[col]}"`
      : `${tableAlias}.${String(col)} as "${String(col)}"`
  );
};
