import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../css/DashboardOwner.css";
import { API_URL } from "../config/api";

interface Product {
  id: number;
  kodeBarang: string;
  name: string;
  isActive: boolean;
}

interface Stock {
  id: number;
  productId: number;
  locationId: number;
  quantity: number;
  product?: {
    id: number;
    kodeBarang: string;
    name: string;
  };
  location?: {
    id: number;
    name: string;
  };
}

interface Location {
  id: number;
  name: string;
}

interface TransactionItem {
  id: number;
  productId: number;
  quantity: number;
  product?: {
    id: number;
    kodeBarang: string;
    name: string;
    category?: {
      id: number;
      name: string;
    };
    unit?: {
      id: number;
      name: string;
      symbol: string;
    };
  };
}

interface Transaction {
  id: number;
  transactionNumber: string;
  type: "PRODUKSI" | "MUTASI" | "PENGELUARAN";
  fromLocation?: {
    id: number;
    name: string;
  } | null;
  toLocation?: {
    id: number;
    name: string;
  } | null;
  user?: {
    id: number;
    username: string;
    role: string;
  } | null;
  notes?: string | null;
  createdAt: string;
  items: TransactionItem[];
}

interface MutationRequestItem {
  id: number;
  productId: number;
  quantity: number;
  product?: {
    id: number;
    kodeBarang: string;
    name: string;
    unit?: {
      id: number;
      name: string;
      symbol: string;
    };
  };
}

interface MutationRequest {
  id: number;
  requestNumber: string;
  status: "REQUESTED" | "COMPLETED";
  notes?: string | null;
  createdAt: string;
  fromLocation?: {
    id: number;
    name: string;
  };
  toLocation?: {
    id: number;
    name: string;
  };
  user?: {
    id: number;
    username: string;
    role: string;
  };
  items: MutationRequestItem[];
}

function DashboardOwner() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [requests, setRequests] = useState<MutationRequest[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [transactionPage, setTransactionPage] =
    useState<number>(0);

  const [transactionDate, setTransactionDate] =
    useState<string>("");

  const [transactionType, setTransactionType] =
    useState<string>("ALL");

  const transactionsPerPage = 5;

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      setError("");

      if (!token) {
        window.location.href = "/";
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [
        productsResponse,
        stocksResponse,
        locationsResponse,
        transactionsResponse,
        requestsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/api/products`, {
          method: "GET",
          headers,
        }),
        fetch(`${API_URL}/api/stocks`, {
          method: "GET",
          headers,
        }),
        fetch(`${API_URL}/api/locations`, {
          method: "GET",
          headers,
        }),
        fetch(`${API_URL}/api/transactions`, {
          method: "GET",
          headers,
        }),
        fetch(`${API_URL}/api/mutation`, {
          method: "GET",
          headers,
        }),
      ]);

      const [
        productsData,
        stocksData,
        locationsData,
        transactionsData,
        requestsData,
      ] = await Promise.all([
        productsResponse.json(),
        stocksResponse.json(),
        locationsResponse.json(),
        transactionsResponse.json(),
        requestsResponse.json(),
      ]);

      if (!productsResponse.ok) {
        throw new Error(
          productsData.message ||
            "Gagal mengambil data produk."
        );
      }

      if (!stocksResponse.ok) {
        throw new Error(
          stocksData.message ||
            "Gagal mengambil data stok."
        );
      }

      if (!locationsResponse.ok) {
        throw new Error(
          locationsData.message ||
            "Gagal mengambil data lokasi."
        );
      }

      if (!transactionsResponse.ok) {
        throw new Error(
          transactionsData.message ||
            "Gagal mengambil data transaksi."
        );
      }

      if (!requestsResponse.ok) {
        throw new Error(
          requestsData.message ||
            "Gagal mengambil data request."
        );
      }

      setProducts(
        Array.isArray(productsData)
          ? productsData
          : []
      );

      setStocks(
        Array.isArray(stocksData)
          ? stocksData
          : []
      );

      setLocations(
        Array.isArray(locationsData)
          ? locationsData
          : []
      );

      setTransactions(
        Array.isArray(transactionsData)
          ? transactionsData
          : []
      );

      setRequests(
        Array.isArray(requestsData?.data)
          ? requestsData.data
          : []
      );
    } catch (error) {
      console.error(
        "DASHBOARD OWNER ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const activeProducts = products.filter(
    (product) =>
      product.isActive !== false
  );

  const totalStock = stocks.reduce(
    (total, stock) =>
      total + Number(stock.quantity || 0),
    0
  );

  const dapurLocation = locations.find(
    (location) =>
      location.name
        ?.trim()
        .toUpperCase() === "DAPUR"
  );

  const tokoLocation = locations.find(
    (location) =>
      location.name
        ?.trim()
        .toUpperCase() === "TOKO"
  );

  const dapurStock = stocks
    .filter(
      (stock) =>
        dapurLocation &&
        Number(stock.locationId) ===
          Number(dapurLocation.id)
    )
    .reduce(
      (total, stock) =>
        total + Number(stock.quantity || 0),
      0
    );

  const tokoStock = stocks
    .filter(
      (stock) =>
        tokoLocation &&
        Number(stock.locationId) ===
          Number(tokoLocation.id)
    )
    .reduce(
      (total, stock) =>
        total + Number(stock.quantity || 0),
      0
    );

  const pendingRequests =
    requests.filter(
      (request) =>
        request.status === "REQUESTED"
    ).length;

  const filteredTransactions =
    transactions.filter((transaction) => {
      const matchesType =
        transactionType === "ALL" ||
        transaction.type === transactionType;

      let matchesDate = true;

      if (transactionDate) {
        const date = new Date(
          transaction.createdAt
        );

        const year = date.getFullYear();
        const month = String(
          date.getMonth() + 1
        ).padStart(2, "0");
        const day = String(
          date.getDate()
        ).padStart(2, "0");

        const transactionDateValue =
          `${year}-${month}-${day}`;

        matchesDate =
          transactionDateValue ===
          transactionDate;
      }

      return matchesType && matchesDate;
    });

  const totalTransactionPages = Math.ceil(
    filteredTransactions.length /
      transactionsPerPage
  );

  const transactionStartIndex =
    transactionPage *
    transactionsPerPage;

  const recentTransactions =
    filteredTransactions.slice(
      transactionStartIndex,
      transactionStartIndex +
        transactionsPerPage
    );

  const recentRequests =
    requests.slice(0, 5);

  const formatDate = (
    date: string
  ) => {
    return new Date(date).toLocaleString(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getTransactionLabel = (
    type: string
  ) => {
    if (type === "PRODUKSI") {
      return "Produksi";
    }

    if (type === "MUTASI") {
      return "Mutasi";
    }

    if (type === "PENGELUARAN") {
      return "Pengeluaran";
    }

    return type;
  };

  const getTransactionDescription = (
    transaction: Transaction
  ) => {
    if (
      transaction.type ===
      "PRODUKSI"
    ) {
      return `Produksi ke ${
        transaction.toLocation?.name ||
        "-"
      }`;
    }

    if (
      transaction.type ===
      "MUTASI"
    ) {
      return `${
        transaction.fromLocation
          ?.name || "-"
      } → ${
        transaction.toLocation
          ?.name || "-"
      }`;
    }

    if (
      transaction.type ===
      "PENGELUARAN"
    ) {
      return `Keluar dari ${
        transaction.fromLocation
          ?.name || "-"
      }`;
    }

    return "-";
  };

  const getTransactionItems = (
    transaction: Transaction
  ) => {
    if (
      !transaction.items ||
      transaction.items.length === 0
    ) {
      return "Tidak ada barang";
    }

    return transaction.items
      .map((item) => {
        const productName =
          item.product?.name ||
          `Product ID ${item.productId}`;

        const unit =
          item.product?.unit?.symbol ||
          item.product?.unit?.name ||
          "pcs";

        return `${productName} • ${item.quantity} ${unit}`;
      })
      .join(", ");
  };

  const getRequestItems = (
    request: MutationRequest
  ) => {
    if (
      !request.items ||
      request.items.length === 0
    ) {
      return "Tidak ada barang";
    }

    return request.items
      .map((item) => {
        const productName =
          item.product?.name ||
          `Product ID ${item.productId}`;

        const unit =
          item.product?.unit?.symbol ||
          item.product?.unit?.name ||
          "pcs";

        return `${productName} • ${item.quantity} ${unit}`;
      })
      .join(", ");
  };

  const handlePreviousTransactions = () => {
    if (transactionPage > 0) {
      setTransactionPage(
        transactionPage - 1
      );
    }
  };

  const handleNextTransactions = () => {
    if (
      transactionPage <
      totalTransactionPages - 1
    ) {
      setTransactionPage(
        transactionPage + 1
      );
    }
  };

  const handleTransactionDateChange = (
    value: string
  ) => {
    setTransactionDate(value);
    setTransactionPage(0);
  };

  const handleTransactionTypeChange = (
    value: string
  ) => {
    setTransactionType(value);
    setTransactionPage(0);
  };

  const handleResetTransactionFilter = () => {
    setTransactionDate("");
    setTransactionType("ALL");
    setTransactionPage(0);
  };

  useEffect(() => {
    if (
      totalTransactionPages > 0 &&
      transactionPage >=
        totalTransactionPages
    ) {
      setTransactionPage(
        totalTransactionPages - 1
      );
    }

    if (
      totalTransactionPages === 0 &&
      transactionPage !== 0
    ) {
      setTransactionPage(0);
    }
  }, [
    filteredTransactions.length,
    totalTransactionPages,
    transactionPage,
  ]);

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />

        <div className="owner-loading">
          <div className="loading-spinner"></div>

          <h3>
            Memuat dashboard...
          </h3>

          <p>
            Sedang mengambil data
            Westhoff.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="owner-dashboard-container">
        <section className="owner-header">
          <div>
            <span className="owner-label">
              OWNER DASHBOARD
            </span>

            <h1>
              Dashboard Owner
            </h1>

            <p>
              Pantau kondisi stok dan
              aktivitas operasional
              Westhoff.
            </p>
          </div>

          <div className="owner-status">
            <span className="status-dot"></span>
            Sistem Aktif
          </div>
        </section>

        {error && (
          <div className="owner-error">
            <span>!</span>
            {error}
          </div>
        )}

        <section className="owner-stat-grid">
          <div className="owner-stat-card">
            <div className="stat-card-icon">
              📦
            </div>

            <div className="stat-card-content">
              <span>
                PRODUK AKTIF
              </span>

              <strong>
                {activeProducts.length}
              </strong>

              <small>
                Produk tersedia
              </small>
            </div>
          </div>

          <div className="owner-stat-card">
            <div className="stat-card-icon">
              📊
            </div>

            <div className="stat-card-content">
              <span>
                TOTAL STOK
              </span>

              <strong>
                {totalStock.toLocaleString(
                  "id-ID"
                )}
              </strong>

              <small>
                Semua lokasi
              </small>
            </div>
          </div>

          <div className="owner-stat-card">
            <div className="stat-card-icon">
              🔄
            </div>

            <div className="stat-card-content">
              <span>
                TRANSAKSI
              </span>

              <strong>
                {transactions.length}
              </strong>

              <small>
                Semua transaksi
              </small>
            </div>
          </div>

          <div className="owner-stat-card">
            <div className="stat-card-icon">
              📋
            </div>

            <div className="stat-card-content">
              <span>
                REQUEST AKTIF
              </span>

              <strong>
                {pendingRequests}
              </strong>

              <small>
                Menunggu diproses
              </small>
            </div>
          </div>
        </section>

        <section className="owner-main-grid">
          <div className="owner-card stock-overview-card">
            <div className="owner-card-header">
              <div>
                <span className="card-label">
                  INVENTORY
                </span>

                <h2>
                  Ringkasan Stok
                </h2>
              </div>
            </div>

            <div className="location-stock-list">
              <div className="location-stock-item">
                <div className="location-stock-info">
                  <div className="location-icon">
                    🏭
                  </div>

                  <div>
                    <strong>
                      DAPUR
                    </strong>

                    <span>
                      Stok produksi
                    </span>
                  </div>
                </div>

                <strong className="location-stock-value">
                  {dapurStock.toLocaleString(
                    "id-ID"
                  )}
                </strong>
              </div>

              <div className="location-stock-item">
                <div className="location-stock-info">
                  <div className="location-icon">
                    🏪
                  </div>

                  <div>
                    <strong>
                      TOKO
                    </strong>

                    <span>
                      Stok penjualan
                    </span>
                  </div>
                </div>

                <strong className="location-stock-value">
                  {tokoStock.toLocaleString(
                    "id-ID"
                  )}
                </strong>
              </div>
            </div>
          </div>

          <div className="owner-card request-overview-card">
            <div className="owner-card-header">
              <div>
                <span className="card-label">
                  REQUEST BARANG
                </span>

                <h2>
                  Request Terbaru
                </h2>
              </div>

              <span className="request-count">
                {pendingRequests} aktif
              </span>
            </div>

            {recentRequests.length ===
            0 ? (
              <div className="empty-owner-data">
                <span>📋</span>

                <strong>
                  Belum ada request
                </strong>

                <p>
                  Request barang akan
                  muncul di sini.
                </p>
              </div>
            ) : (
              <div className="request-list">
                {recentRequests.map(
                  (request) => (
                    <div
                      className="owner-request-item"
                      key={request.id}
                    >
                      <div className="request-item-main">
                        <strong>
                          {
                            request.requestNumber
                          }
                        </strong>

                        <span>
                          {getRequestItems(
                            request
                          )}
                        </span>

                        <span>
                          {request.user
                            ?.username ||
                            "-"}
                        </span>
                      </div>

                      <div className="request-item-side">
                        <span
                          className={`request-status ${
                            request.status ===
                            "REQUESTED"
                              ? "status-requested"
                              : "status-completed"
                          }`}
                        >
                          {request.status ===
                          "REQUESTED"
                            ? "Menunggu"
                            : "Selesai"}
                        </span>

                        <small>
                          {formatDate(
                            request.createdAt
                          )}
                        </small>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </section>

        <section className="owner-card transaction-card">
          <div className="owner-card-header">
            <div>
              <span className="card-label">
                ACTIVITY
              </span>

              <h2>
                Transaksi Terbaru
              </h2>
            </div>

            <span className="transaction-count">
              {filteredTransactions.length} transaksi
            </span>
          </div>

          <div className="transaction-filter">
            <div className="transaction-filter-item">
              <label>
                Tanggal
              </label>

              <input
                type="date"
                value={transactionDate}
                onChange={(event) =>
                  handleTransactionDateChange(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="transaction-filter-item">
              <label>
                Jenis Transaksi
              </label>

              <select
                value={transactionType}
                onChange={(event) =>
                  handleTransactionTypeChange(
                    event.target.value
                  )
                }
              >
                <option value="ALL">
                  Semua Transaksi
                </option>

                <option value="PRODUKSI">
                  Produksi
                </option>

                <option value="MUTASI">
                  Mutasi
                </option>

                <option value="PENGELUARAN">
                  Pengeluaran
                </option>
              </select>
            </div>

            {(transactionDate ||
              transactionType !== "ALL") && (
              <button
                type="button"
                className="transaction-filter-reset"
                onClick={
                  handleResetTransactionFilter
                }
              >
                Reset
              </button>
            )}
          </div>

          {recentTransactions.length ===
          0 ? (
            <div className="empty-owner-data">
              <span>🔍</span>

              <strong>
                Transaksi tidak ditemukan
              </strong>

              <p>
                Tidak ada transaksi yang
                sesuai dengan filter.
              </p>
            </div>
          ) : (
            <>
              <div className="transaction-list">
                {recentTransactions.map(
                  (transaction) => (
                    <div
                      className="owner-transaction-item"
                      key={transaction.id}
                    >
                      <div
                        className={`transaction-type-icon transaction-${transaction.type.toLowerCase()}`}
                      >
                        {transaction.type ===
                        "PRODUKSI"
                          ? "＋"
                          : transaction.type ===
                            "MUTASI"
                          ? "↔"
                          : "−"}
                      </div>

                      <div className="transaction-main">
                        <div>
                          <strong>
                            {
                              transaction.transactionNumber
                            }
                          </strong>

                          <span
                            className={`transaction-type transaction-type-${transaction.type.toLowerCase()}`}
                          >
                            {getTransactionLabel(
                              transaction.type
                            )}
                          </span>
                        </div>

                        <p>
                          {getTransactionDescription(
                            transaction
                          )}
                        </p>
                      </div>

                      <div className="transaction-meta">
                        <strong>
                          {getTransactionItems(
                            transaction
                          )}
                        </strong>

                        <span>
                          {transaction.user
                            ?.username ||
                            "-"}
                        </span>

                        <small>
                          {formatDate(
                            transaction.createdAt
                          )}
                        </small>
                      </div>
                    </div>
                  )
                )}
              </div>

              {totalTransactionPages >
                1 && (
                <div className="transaction-pagination">
                  {transactionPage >
                    0 && (
                    <button
                      type="button"
                      onClick={
                        handlePreviousTransactions
                      }
                    >
                      ↑
                    </button>
                  )}

                  {transactionPage <
                    totalTransactionPages - 1 && (
                    <button
                      type="button"
                      onClick={
                        handleNextTransactions
                      }
                    >
                      ↓
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default DashboardOwner;