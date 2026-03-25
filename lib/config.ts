const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const config = {
  api: {
    assessment: `${API_URL}/api/assessment`,
  },
};

export default config;
