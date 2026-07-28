export const defaultKeyGenerator = (
  req: any
): string => {

  return (
    req.ip ||
    req.headers["x-forwarded-for"] ||
    req.socket?.remoteAddress ||
    "unknown"
  );

};