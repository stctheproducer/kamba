// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
import { Exception } from '@adonisjs/core/exceptions'

// Define the result tuple type
type Result<T, E> = [T, null] | [null, E]

/**
 * Wraps an async function call in a try-catch block
 * and returns a tuple with the result or error.
 */
export async function tryCatch<T = any, E = Error | Exception>(
  operation: () => Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await operation()
    return [data, null] as const
  } catch (error) {
    return [null, error as E] as const
  }
}

/**
 * Wraps a synchronous function call in a try-catch block
 * and returns a tuple with the result or error.
 */
export function tryCatchSync<T = any, E = Error | Exception>(operation: () => T): Result<T, E> {
  try {
    const data = operation()
    return [data, null]
  } catch (error) {
    return [null, error as E]
  }
}
