import { api, getErrorMessage } from '@/lib/api'

export async function apiGet<T>(url: string): Promise<T> {
  const { data } = await api.get<T>(url)
  return data
}

export function parseApiError(error: unknown): string {
  return getErrorMessage(error)
}
