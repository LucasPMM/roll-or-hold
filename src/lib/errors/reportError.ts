export const reportRecoverableError = (context: string, error: unknown): void => {
  console.warn(`[Roll or Hold] ${context}`, error)
}
