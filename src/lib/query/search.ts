import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { EntityType } from '../../global';

type searchQuery = <T extends ObjectLiteral>(
  { columns, value }: { columns: (keyof EntityType<T>)[]; value: string | undefined | null },
  query: SelectQueryBuilder<T>
) => SelectQueryBuilder<T>;

export const searchQuery: searchQuery = ({ columns, value }, query) => {
  if (!value) return query;
  columns.forEach((column) => {
    if (typeof column !== 'string') {
      throw new Error('Column must be a string');
    }
    query.andWhere(`${String(column)} ILIKE :search`, { search: `%${value}%` });
  });
  return query;
};
