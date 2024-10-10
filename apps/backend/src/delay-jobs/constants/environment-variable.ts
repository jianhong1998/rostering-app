export const featureFlags = {
  enablePostmarkEmailService:
    process.env.ENABLE_POSTMARK_EMAIL_SERVICE === 'true',
} satisfies Record<string, boolean>;

export const environmentVariables = {
  postmarkServerToken: process.env.POSTMARK_SERVER_TOKEN ?? '',
};
