export interface ConsumeResult {
  allowed: boolean;

  remaining: number;

  limit: number;

  retryAfter: number;

  resetAt: number;
}