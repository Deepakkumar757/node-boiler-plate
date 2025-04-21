import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

type pagination = <T extends ObjectLiteral>(
  { limit, page }: { limit: number; page: number },
  query: SelectQueryBuilder<T>
) => SelectQueryBuilder<T>;

export const pagination: pagination = ({ limit, page }, query) => {
  if (!limit || !page) return query;
  const skip = (page - 1) * limit;
  query.take(limit).skip(skip);
  return query;
};
