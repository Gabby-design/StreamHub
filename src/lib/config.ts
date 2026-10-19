export const config = {
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    name: 'StreamHub',
    description: 'Modern Video Streaming and Sharing Platform',
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    isConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase-project')
    ),
  },
  mux: {
    tokenId: process.env.MUX_TOKEN_ID || '',
    tokenSecret: process.env.MUX_TOKEN_SECRET || '',
    envKey: process.env.NEXT_PUBLIC_MUX_ENV_KEY || '',
    isConfigured: Boolean(
      process.env.MUX_TOKEN_ID &&
      process.env.MUX_TOKEN_SECRET &&
      process.env.MUX_TOKEN_ID !== 'your-mux-token-id'
    ),
  },
  cloudflare: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
    apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
    customerCode: process.env.CLOUDFLARE_STREAM_CUSTOMER_CODE || '',
    isConfigured: Boolean(
      process.env.CLOUDFLARE_ACCOUNT_ID &&
      process.env.CLOUDFLARE_API_TOKEN &&
      process.env.CLOUDFLARE_ACCOUNT_ID !== 'your-cloudflare-account-id'
    ),
  },
};
