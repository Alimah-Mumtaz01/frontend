import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";

import {
    Search,
    ChevronLeft,
    ChevronRight,
    Users,
    LoaderCircle,
    AlertCircle,
    RefreshCw,
    Eye,
} from "lucide-react";

import { getCustomers } from "../../../services/customerService";

import type {
    Customer,
    CustomerPagination,
} from "../../../types/customer";

const ITEMS_PER_PAGE = 8;

const emptyPagination: CustomerPagination = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: ITEMS_PER_PAGE,
};

const CustomerList = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [pagination, setPagination] =
        useState<CustomerPagination>(emptyPagination);

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);

    const fetchCustomers = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const result = await getCustomers({
                page,
                limit: ITEMS_PER_PAGE,
                search: search.trim(),
            });

            setCustomers(result.customers || []);
            setPagination(result.pagination || emptyPagination);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Terjadi kesalahan saat mengambil data pelanggan."
            );

            setCustomers([]);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handlePageChange = (newPage: number) => {
        if (
            newPage < 1 ||
            newPage > pagination.totalPages ||
            newPage === page
        ) {
            return;
        }

        setPage(newPage);
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-[#FFF7F9] px-4 py-6 sm:px-6 lg:px-8">
            {/* HEADER */}
            <div className="mb-7">
                <h1 className="text-2xl font-bold text-[#590D22]">
                    Data Pelanggan
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Kelola informasi dan riwayat pesanan pelanggan SoeSweet.
                </p>
            </div>

            {/* SEARCH */}
            <div className="mb-5">
                <div className="relative">
                    <Search
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B5263]"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Cari nama atau email..."
                        className="h-12 w-full rounded-xl border border-[#F2D5DE] bg-white pl-12 pr-4 text-sm text-[#590D22] outline-none transition placeholder:text-gray-400 focus:border-[#C9184A] focus:ring-2 focus:ring-[#C9184A]/10"
                    />
                </div>
            </div>

            {/* TABEL PELANGGAN */}
            <div className="overflow-hidden rounded-2xl border border-[#F3DCE3] bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] border-collapse text-left">
                        <thead>
                            <tr className="bg-[#FFF0F3] text-sm font-semibold text-[#590D22]">
                                <th className="px-6 py-4">Nama</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">No. HP</th>
                                <th className="px-6 py-4 text-center">
                                    Total Pesanan
                                </th>
                                <th className="px-6 py-4 text-center">
                                    Aksi
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#F8E9EE]">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <LoaderCircle
                                                size={30}
                                                className="animate-spin text-[#C9184A]"
                                            />

                                            <p className="text-sm text-gray-500">
                                                Memuat data pelanggan...
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <AlertCircle
                                                size={32}
                                                className="text-red-400"
                                            />

                                            <p className="text-sm text-red-500">
                                                {error}
                                            </p>

                                            <button
                                                onClick={fetchCustomers}
                                                className="flex items-center gap-2 rounded-lg bg-[#C9184A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#A4133C]"
                                            >
                                                <RefreshCw size={15} />
                                                Coba Lagi
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF0F3]">
                                                <Users
                                                    size={27}
                                                    className="text-[#C9184A]"
                                                />
                                            </div>

                                            <p className="font-semibold text-[#590D22]">
                                                Pelanggan tidak ditemukan
                                            </p>

                                            <p className="text-sm text-gray-400">
                                                Belum ada data pelanggan yang sesuai.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr
                                        key={customer.id_user}
                                        className="text-sm text-[#590D22] transition hover:bg-[#FFF9FA]"
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            {customer.nama}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {customer.email}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {customer.no_hp || "-"}
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex min-w-9 items-center justify-center rounded-lg bg-[#FFF0F3] px-3 py-1.5 font-semibold text-[#C9184A]">
                                                {customer.total_pesanan}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <Link
                                                to={`/admin/customers/detail/${customer.id_user}`}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFF0F3] px-4 py-2.5 text-sm font-bold text-[#C9184A] transition hover:bg-pink-200"
                                                title="Lihat detail pelanggan"
                                            >
                                                <Eye size={17} />
                                                Detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {!loading && !error && (
                    <div className="flex flex-col gap-4 border-t border-[#F8E9EE] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-500">
                            Menampilkan{" "}
                            <span className="font-semibold text-[#590D22]">
                                {customers.length > 0
                                    ? (page - 1) * ITEMS_PER_PAGE + 1
                                    : 0}
                            </span>
                            {" - "}
                            <span className="font-semibold text-[#590D22]">
                                {Math.min(
                                    page * ITEMS_PER_PAGE,
                                    pagination.totalItems
                                )}
                            </span>
                            {" dari "}
                            <span className="font-semibold text-[#590D22]">
                                {pagination.totalItems}
                            </span>
                            {" pelanggan"}
                        </p>

                        <div className="flex items-center justify-end gap-2">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page <= 1}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#F3DCE3] text-[#8B5263] transition hover:bg-[#FFF0F3] disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Halaman sebelumnya"
                            >
                                <ChevronLeft size={19} />
                            </button>

                            {Array.from(
                                { length: pagination.totalPages },
                                (_, index) => index + 1
                            ).map((number) => (
                                <button
                                    key={number}
                                    onClick={() => handlePageChange(number)}
                                    className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition ${
                                        page === number
                                            ? "bg-[#C9184A] text-white shadow-sm"
                                            : "border border-[#F3DCE3] text-[#8B5263] hover:bg-[#FFF0F3]"
                                    }`}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page >= pagination.totalPages}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#F3DCE3] text-[#8B5263] transition hover:bg-[#FFF0F3] disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Halaman berikutnya"
                            >
                                <ChevronRight size={19} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerList;