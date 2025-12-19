function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  
  if (!value && !defaultValue) {
    console.error(`Missing required environment variable: ${key}`);
    return '';
  }
  
  return value || defaultValue || '';
}

export const env = {
  apiUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'https://hotel-back.spectralv0id.com'),
} as const;

if (typeof window === 'undefined') {
  console.log('Environment configuration:', {
    apiUrl: env.apiUrl,
  });
}

