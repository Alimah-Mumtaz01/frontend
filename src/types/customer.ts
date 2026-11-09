export interface Customer {
  id_user: number;
  nama: string;
  email: string;
  no_hp: string;
  total_pesanan: number;
}

export interface CustomerPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export interface CustomerApiResponse {
  success: boolean;
  message: string;
  data: {
    customers: Customer[];
    pagination: CustomerPagination;
  };
}

export interface CustomerParams {
  page?: number;
  limit?: number;
  search?: string;
}