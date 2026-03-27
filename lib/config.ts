export const config = {
  api: {
    assessment: '/api/assessment',
    result: (id: string) => `/api/result/${id}`,
    callback: '/api/callback',
    health: '/api/health',
  },
  polling: {
    intervalMs: 3000,
    maxAttempts: 60,
  },
};

export default config;
