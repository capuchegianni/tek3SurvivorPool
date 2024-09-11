import { TBot } from '../types/Bot'

export function getSafeEnv(key: string | undefined, name: string): string {
    if (!key)
        throw new Error(`Could not find ${name} in your environment`)
    return key
}

export function isTruthy<T>(value: T | undefined | null): value is T {
    return !!value
}

export function isString(value: unknown): value is string {
    return typeof value === 'string'
}

export function isNumber(value: unknown): value is number {
    return typeof value === 'number'
}

export function isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
}

export function isObject(value: unknown): value is Record<string, unknown>{
    return typeof value === 'object'
}

export function isFunction(value: unknown): value is Function {
    return typeof value === 'function'
}

export function isBot(value: unknown): value is TBot {
    return value !== null && typeof value === 'object' &&
        typeof (value as TBot).id === 'string' &&
        typeof (value as TBot).maintenance === 'boolean'
}