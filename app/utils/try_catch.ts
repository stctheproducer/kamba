// Define the result tuple type
type TryCatchResult<T, E> = [T | null, E | null]

/**
 * Wraps an async function call in a try-catch block
 * and returns a tuple with the result or error.
 */
export async function tryCatch<T, E>(fn: () => Promise<T>): Promise<TryCatchResult<T, E>> {
  try {
    const result = await fn()
    return [result, null]
  } catch (error) {
    return [null, error as E]
  }
}

/**
 * Wraps a synchronous function call in a try-catch block
 * and returns a tuple with the result or error.
 */
export function tryCatchSync<T, E>(fn: () => T): TryCatchResult<T, E> {
  try {
    const result = fn()
    return [result, null]
  } catch (error) {
    return [null, error as E]
  }
}
