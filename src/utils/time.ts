export const getCurrentTime = (): number => {
  return Date.now();
};


export const getSeconds = (
  milliseconds: number
): number => {
  return Math.ceil(milliseconds / 1000);
};


export const getResetTime = (
  timestamp: number,
  windowMs: number
): number => {
  return timestamp + windowMs;
};