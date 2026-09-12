const userAgent = process.env.npm_config_user_agent ?? ''

if (!userAgent.startsWith('pnpm/')) {
  throw new Error('This project uses pnpm. Run pnpm install instead.')
}
