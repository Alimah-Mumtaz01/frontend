
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL belum dikonfigurasi. Periksa file .env."
  );
}

/**
 * Mengirim request JSON ke backend SoeSweet.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
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
 *
 * Jika gambar sudah berupa URL lengkap, URL digunakan langsung.
 * Jika hanya berupa path, gambar diarahkan ke server backend.
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

  const baseUrl = API_BASE_URL.replace(/\/api\/?$/, "");

  return `${baseUrl}/${imagePath.replace(/^\/+/, "")}`;
}

/**
 * Mengambil daftar data dari beberapa bentuk response API.
 *
 * Mendukung:
 * - [...]
 * - { data: [...] }
 * - { success: true, data: [...] }
 * - { products: [...] }
 * - { variants: [...] }
 */
export function extractList<T>(
  response: unknown,
  alternativeKey?: string
): T[] {
  if (Array.isArray(response)) {
    return response as T[];
  }

  if (
    response &&
    typeof response === "object"
  ) {
    const result = response as Record<string, unknown>;

    if (Array.isArray(result.data)) {
      return result.data as T[];
    }

    if (Array.isArray(result[alternativeKey || ""])) {
      return result[alternativeKey || ""] as T[];
    }
  }

  return [];
}
