import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";
import "../css/DashboardDapur.css";
import { API_URL } from "../config/api";

interface StockItem {
  id: number;
  quantity: number;

  product: {
    id: number;
    kodeBarang: string;
    name: string;

    unit: {
      id: number;
      name: string;
      symbol: string;
    };
  };

  location: {
    id: number;
    name: string;
  };
}

interface MutationRequestItem {
  id: number;
  requestId: number;
  productId: number;
  quantity: number;

  product: {
    id: number;
    kodeBarang: string;
    name: string;

    unit: {
      id: number;
      name: string;
      symbol: string;
    };
  };
}

interface MutationRequest {
  id: number;
  requestNumber: string;
  status: string;
  notes: string | null;
  createdAt: string;

  fromLocation: {
    id: number;
    name: string;
  };

  toLocation: {
    id: number;
    name: string;
  };

  user: {
    id: number;
    username: string;
    role: string;
  };

  items: MutationRequestItem[];
}

function DashboardDapur() {
  const [search, setSearch] = useState<string>("");

  const [stockData, setStockData] = useState<StockItem[]>([]);

  const [requests, setRequests] = useState<MutationRequest[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [requestLoading, setRequestLoading] = useState<boolean>(true);

  const [completingRequestId, setCompletingRequestId] = useState<number | null>(
    null,
  );

  const [error, setError] = useState<string>("");

  const [requestError, setRequestError] = useState<string>("");

  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/";
          return;
        }

        const response = await fetch(`${API_URL}/api/stocks`, {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Gagal mengambil data stok.");
        }

        if (!Array.isArray(data)) {
          throw new Error("Format data stok dari server tidak valid.");
        }

        setStockData(data);
        setError("");
      } catch (error) {
        console.error("FETCH STOCK ERROR:", error);

        setError(
          error instanceof Error ? error.message : "Gagal mengambil data stok.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();

    const interval = setInterval(() => {
      fetchStocks();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/";
          return;
        }

        const response = await fetch(`${API_URL}/api/mutation`, {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Gagal mengambil request barang.");
        }

        if (!Array.isArray(data.data)) {
          throw new Error("Format data request dari server tidak valid.");
        }

        setRequests(
          data.data.filter(
            (request: MutationRequest) => request.status === "REQUESTED",
          ),
        );

        setRequestError("");
      } catch (error) {
        console.error("FETCH REQUEST ERROR:", error);

        setRequestError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil request barang.",
        );
      } finally {
        setRequestLoading(false);
      }
    };

    fetchRequests();

    const interval = setInterval(() => {
      fetchRequests();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const kitchenStock = useMemo(() => {
    return stockData.filter(
      (item) => item.location?.name?.toUpperCase() === "DAPUR",
    );
  }, [stockData]);

  const filteredStock = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return kitchenStock;
    }

    return kitchenStock.filter((item) => {
      const productName = item.product?.name?.toLowerCase() || "";

      const kodeBarang = item.product?.kodeBarang?.toLowerCase() || "";

      const locationName = item.location?.name?.toLowerCase() || "";

      return (
        productName.includes(keyword) ||
        kodeBarang.includes(keyword) ||
        locationName.includes(keyword)
      );
    });
  }, [kitchenStock, search]);

  const getKitchenStock = (productId: number): number => {
    const stock = kitchenStock.find((item) => item.product.id === productId);

    return stock ? stock.quantity : 0;
  };

  const canCompleteRequest = (request: MutationRequest): boolean => {
    return request.items.every(
      (item) => getKitchenStock(item.productId) >= item.quantity,
    );
  };

  const handleCompleteRequest = async (requestId: number) => {
    const request = requests.find((item) => item.id === requestId);

    if (!request) {
      return;
    }

    if (!canCompleteRequest(request)) {
      alert("Stok dapur belum mencukupi untuk menyelesaikan request ini.");
      return;
    }

    try {
      setCompletingRequestId(requestId);

      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/";
        return;
      }

      const response = await fetch(
        `${API_URL}/api/mutation/${requestId}/complete`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menyelesaikan request.");
      }

      setRequests((currentRequests) =>
        currentRequests.filter((request) => request.id !== requestId),
      );

      const stockResponse = await fetch(`${API_URL}/api/stocks`, {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,

          "Content-Type": "application/json",
        },
      });

      const stockResult = await stockResponse.json();

      if (stockResponse.ok && Array.isArray(stockResult)) {
        setStockData(stockResult);
      }

      setSuccess(
        data.message ||
          "Request berhasil diselesaikan dan stock berhasil dipindahkan.",
      );

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (error) {
      console.error("COMPLETE REQUEST ERROR:", error);

      alert(
        error instanceof Error ? error.message : "Gagal menyelesaikan request.",
      );
    } finally {
      setCompletingRequestId(null);
    }
  };

  const today = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="dashboard-page">
      <Navbar />

      {success && (
        <div className="request-success-toast">
          <div className="request-success-icon">✓</div>

          <div className="request-success-content">
            <strong>Request Berhasil</strong>

            <span>{success}</span>
          </div>
        </div>
      )}

      <main className="dashboard-container">
        <section className="dashboard-header">
          <div>
            <h1>Dashboard Dapur</h1>

            <p className="dashboard-description">
              Kelola stok produksi dan pengiriman kue ke toko.
            </p>
          </div>

          <div className="header-date">
            <span className="date-icon">📅</span>

            <div>
              <span className="date-label">Hari ini</span>

              <span className="date-value">{today}</span>
            </div>
          </div>
        </section>

        <section className="action-grid">
          <div
            className="action-card stock-action"
            onClick={() => {
              window.location.href = "/dashboard-dapur/tambah-stok";
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                window.location.href = "/dashboard-dapur/tambah-stok";
              }
            }}
          >
            <div className="action-icon">📦</div>

            <div className="action-content">
              <h2>Produksi</h2>

              <p>Tambahkan stok kue yang tersedia di dapur.</p>
            </div>

            <span className="action-arrow">→</span>
          </div>
        </section>

        <section className="request-section">
          <div className="section-header">
            <div>
              <h2>Request dari Toko</h2>

              <p>Permintaan barang yang perlu dikirim ke toko.</p>
            </div>

            <div className="stock-count">{requests.length} request</div>
          </div>

          {requestLoading && (
            <div className="empty-state">
              <div className="empty-icon">🔄</div>

              <h3>Memuat request...</h3>

              <p>Sedang mengambil request dari server.</p>
            </div>
          )}

          {!requestLoading && requestError && (
            <div className="empty-state">
              <div className="empty-icon">⚠️</div>

              <h3>Gagal mengambil request</h3>

              <p>{requestError}</p>
            </div>
          )}

          {!requestLoading && !requestError && requests.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📭</div>

              <h3>Tidak ada request</h3>

              <p>Belum ada permintaan barang dari toko.</p>
            </div>
          )}

          {!requestLoading && !requestError && requests.length > 0 && (
            <div className="request-list">
              {requests.map((request) => {
                const requestCanBeCompleted = canCompleteRequest(request);

                return (
                  <div className="request-card" key={request.id}>
                    <div className="request-card-header">
                      <div>
                        <span className="request-number">
                          {request.requestNumber}
                        </span>

                        <h3>Request dari {request.user.username}</h3>
                      </div>

                      <span className="request-status">REQUESTED</span>
                    </div>

                    <div className="request-items">
                      {request.items.map((item) => {
                        const currentStock = getKitchenStock(item.productId);

                        const stockEnough = currentStock >= item.quantity;

                        return (
                          <div className="request-item" key={item.id}>
                            <div>
                              <strong>{item.product.name}</strong>

                              <span>{item.product.kodeBarang}</span>
                            </div>

                            <div className="request-quantity">
                              <div className="stock-info-box">
                                <span className="info-box-label">
                                  Stok Dapur
                                </span>

                                <strong className="info-box-value">
                                  {currentStock}
                                  <span>{item.product.unit.symbol}</span>
                                </strong>
                              </div>

                              <div className="request-info-box">
                                <span className="info-box-label">Request</span>

                                <strong className="info-box-value">
                                  {item.quantity}
                                  <span>{item.product.unit.symbol}</span>
                                </strong>
                              </div>

                              {!stockEnough && (
                                <small className="stock-warning">
                                  Stok belum cukup
                                </small>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {request.notes && (
                      <p className="request-notes">Catatan: {request.notes}</p>
                    )}

                    <div className="request-card-footer">
                      <span>DAPUR → TOKO</span>

                      <button
                        type="button"
                        className="complete-request-button"
                        onClick={() => handleCompleteRequest(request.id)}
                        disabled={
                          completingRequestId === request.id ||
                          !requestCanBeCompleted
                        }
                      >
                        {completingRequestId === request.id
                          ? "Memproses..."
                          : requestCanBeCompleted
                            ? "Selesaikan Request"
                            : "Stok Belum Cukup"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="stock-section">
          <div className="section-header">
            <div>
              <h2>Stok Dapur</h2>

              <p>Produk yang tersedia di lokasi dapur</p>
            </div>

            <div className="stock-count">{kitchenStock.length} item</div>
          </div>

          <div className="stock-toolbar">
            <div className="search-box">
              <span className="search-icon">⌕</span>

              <input
                type="text"
                placeholder="Cari nama produk, kode, atau lokasi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading && (
            <div className="empty-state">
              <div className="empty-icon">📦</div>

              <h3>Memuat data stok...</h3>

              <p>Sedang mengambil data dari server.</p>
            </div>
          )}

          {!loading && error && (
            <div className="empty-state">
              <div className="empty-icon">⚠️</div>

              <h3>Gagal mengambil data</h3>

              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="stock-table-wrapper">
              <table className="stock-table">
                <thead>
                  <tr>
                    <th>KODE BARANG</th>

                    <th>PRODUK</th>

                    <th>STOK</th>

                    <th>LOKASI</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStock.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span className="item-code">
                          {item.product?.kodeBarang || "-"}
                        </span>
                      </td>

                      <td>
                        <div className="item-name">
                          <div className="item-icon">🧁</div>

                          <span>
                            {item.product?.name || "Produk tidak diketahui"}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="stock-value">
                          <strong
                            className={item.quantity === 0 ? "stock-zero" : ""}
                          >
                            {" "}
                            {item.quantity}{" "}
                          </strong>{" "}
                          <span> {item.product?.unit?.symbol || ""} </span>
                        </div>
                      </td>

                      <td>
                        <div className="location">
                          <span className="location-icon">📍</span>

                          {item.location?.name || "-"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredStock.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>

                  <h3>Belum ada stok</h3>

                  <p>Belum ada produk yang tersedia di dapur.</p>
                </div>
              )}
            </div>
          )}

          {!loading && !error && (
            <div className="table-footer">
              <span>
                Menampilkan <strong>{filteredStock.length}</strong> dari{" "}
                <strong>{kitchenStock.length}</strong> item
              </span>

              <span className="last-update">Data stok dapur</span>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default DashboardDapur;
