import { Request } from 'express';

export type getClientIp = (req: Request) => string;

export const getClientIp: getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }

  return req.socket.remoteAddress || '';
};
