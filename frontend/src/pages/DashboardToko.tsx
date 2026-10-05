import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";
import "../css/DashboardToko.css";
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

function DashboardToko() {
  const [search, setSearch] = useState<string>("");

  const [stockData, setStockData] = useState<StockItem[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchStocks = async (isInitialLoad = false) => {
      try {
        // Loading hanya saat pertama kali membuka halaman
        if (isInitialLoad) {
          setLoading(true);
        }

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

        // Update stok terbaru
        setStockData(data);
        setError("");
      } catch (error) {
        console.error("FETCH STOCK ERROR:", error);

        setError(
          error instanceof Error ? error.message : "Gagal mengambil data stok.",
        );
      } finally {
        // Loading hanya dimatikan untuk fetch pertama
        if (isInitialLoad) {
          setLoading(false);
        }
      }
    };

    // Ambil data pertama kali
    fetchStocks(true);

    // Ambil data stok terbaru setiap 3 detik
    const interval = setInterval(() => {
      fetchStocks(false);
    }, 5000);

    // Hentikan interval ketika halaman ditinggalkan
    return () => {
      clearInterval(interval);
    };
  }, []);

  const storeStock = useMemo(() => {
    return stockData.filter(
      (item) => item.location?.name?.toUpperCase() === "TOKO",
    );
  }, [stockData]);

  const filteredStock = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return storeStock;
    }

    return storeStock.filter((item) => {
      const productName = item.product?.name?.toLowerCase() || "";

      const kodeBarang = item.product?.kodeBarang?.toLowerCase() || "";

      const locationName = item.location?.name?.toLowerCase() || "";

      return (
        productName.includes(keyword) ||
        kodeBarang.includes(keyword) ||
        locationName.includes(keyword)
      );
    });
  }, [storeStock, search]);

  const today = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-container">
        <section className="dashboard-header">
          <div>
            <h1>Dashboard Toko</h1>

            <p className="dashboard-description">
              Kelola stok toko, request barang, dan transaksi penjualan.
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
              window.location.href = "/dashboard-toko/request-barang";
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                window.location.href = "/dashboard-toko/request-barang";
              }
            }}
          >
            <div className="action-icon">📦</div>

            <div className="action-content">
              <h2>Request & Cek Barang</h2>

              <p>
                Request barang dari dapur dan cek fisik barang yang diterima.
              </p>
            </div>

            <span className="action-arrow">→</span>
          </div>

          <div
            className="action-card mutation-action"
            onClick={() => {
              window.location.href = "/dashboard-toko/kasir";
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                window.location.href = "/dashboard-toko/kasir";
              }
            }}
          >
            <div className="action-icon">💰</div>

            <div className="action-content">
              <h2>Kasir</h2>

              <p>Input pembelian pelanggan dan proses transaksi penjualan.</p>
            </div>

            <span className="action-arrow">→</span>
          </div>
        </section>

        <section className="stock-section">
          <div className="section-header">
            <div>
              <h2>Stok Toko</h2>

              <p>Produk yang tersedia di lokasi toko</p>
            </div>

            <div className="stock-count">{storeStock.length} item</div>
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

                          <span
                            style={{
                              color: "#111111",
                              fontSize: "16px",
                              fontWeight: 700,
                            }}
                          >
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

                  <p>Belum ada produk yang tersedia di toko.</p>
                </div>
              )}
            </div>
          )}

          {!loading && !error && (
            <div className="table-footer">
              <span>
                Menampilkan <strong>{filteredStock.length}</strong> dari{" "}
                <strong>{storeStock.length}</strong> item
              </span>

              <span className="last-update">Data stok toko</span>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default DashboardToko;
