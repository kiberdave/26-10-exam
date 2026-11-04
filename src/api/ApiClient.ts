import { API_BASE_URL } from "@/utils/constants";
import { isRecord } from "@/utils/guards";
import { ApiError, isAbortError } from "./ApiError";

/**
 * A small typed HTTP client.
 * - `private readonly baseUrl` — set once in the constructor, hidden from the outside.
 * - `private request<T>()` — the shared logic (fetch, status check, errors) lives in ONE place.
 * - `get<T>()` / `post<T, B>()` — public, generic: one implementation, many response types.
 * The public products API needs no authorization, so no auth headers are sent.
 */
export class ApiClient {
  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    let response: Response;

    try {
      response = await fetch(this.baseUrl + path, init);
    } catch (error: unknown) {
      if (isAbortError(error)) throw error; // cancelled on purpose — let the caller ignore it
      // fetch() only rejects on network problems (offline, DNS, CORS)
      throw new ApiError(0, "Network error. Check your connection and try again.");
    }

    if (!response.ok) {
      throw new ApiError(response.status, await this.readErrorMessage(response));
    }

    // The server response is trusted to match T — this is the one place where we cast.
    return (await response.json()) as T;
  }

  private async readErrorMessage(response: Response): Promise<string> {
    try {
      const body: unknown = await response.json();
      if (isRecord(body) && typeof body.message === "string") return body.message;
    } catch {
      // body was not JSON — fall through to the generic text
    }
    return `Request failed with status ${response.status}`;
  }

  get<T>(path: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(path, { signal });
  }

  post<T, B>(path: string, body: B): Promise<T> {
    // Content-Type only when there is a body: on a GET it would force an extra
    // CORS preflight (OPTIONS) request before every call.
    return this.request<T>(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }
}

// One shared instance for the whole app
export const api = new ApiClient(API_BASE_URL);
