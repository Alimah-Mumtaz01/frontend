const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TOKEN_KEY = "soesweet_token";

if (!API_BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL belum dikonfigurasi. Periksa file .env."
  );
}

/**
 * Mengirim request ke backend 
 * JWT ditambahkan otomatis jika pengguna sudah login.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);

  const headers = new Headers(options.headers);

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const baseUrl = API_BASE_URL.replace(/\/+$/, "");

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const response = await fetch(
    `${baseUrl}${normalizedEndpoint}`,
    {
      ...options,
      headers,
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || "Terjadi kesalahan pada server."
    );
  }

  return data as T;
}

/**
 * Mengambil alamat gambar dari backend.
 */
export function getImageUrl(
  imagePath: string | null | undefined
): string {
  if (!imagePath) {
    return "/images/hero-soes.png";
  }

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  const baseUrl = API_BASE_URL.replace(/\/+$/, "");

  return `${baseUrl}/${imagePath.replace(/^\/+/, "")}`;
}

/**
 * Mengambil daftar data dari berbagai bentuk response API.
 */
export function extractList<T>(
  response: unknown,
  alternativeKey?: string
): T[] {
  if (Array.isArray(response)) {
    return response as T[];
  }

  if (response && typeof response === "object") {
    const result = response as Record<string, unknown>;

    if (Array.isArray(result.data)) {
      return result.data as T[];
    }

    if (
      alternativeKey &&
      Array.isArray(result[alternativeKey])
    ) {
      return result[alternativeKey] as T[];
    }
  }

  return [];
}