function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  
  if (!value && !defaultValue) {
    console.error(`Missing required environment variable: ${key}`);
    return '';
  }
  
  return value || defaultValue || '';
}

export const env = {
  apiUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:5050'),
} as const;

if (typeof window === 'undefined') {
  console.log('Environment configuration:', {
    apiUrl: env.apiUrl,
  });
}

