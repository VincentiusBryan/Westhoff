import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import "../css/RequestBarang.css";
import { API_URL } from "../config/api";

interface Product {
  id: number;
  kodeBarang: string;
  name: string;
  category: {
    id: number;
    name: string;
  };
  unit: {
    id: number;
    name: string;
    symbol: string;
  };
}

interface StockItem {
  id: number;
  productId: number;
  locationId: number;
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

interface RequestItem {
  product: Product;
  quantity: number;
}

/* =========================================================
   MUTATION REQUEST
========================================================= */

interface MutationRequest {
  id: number;
  requestNumber: string;
  status: string;
  createdAt: string;

  items: {
    id: number;
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
  }[];
}

function RequestBarangToko() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [requestItems, setRequestItems] = useState<RequestItem[]>([]);

  /* =========================================================
     HISTORY REQUEST AKTIF
  ========================================================= */

  const [mutationRequests, setMutationRequests] = useState<MutationRequest[]>(
    [],
  );

  const [search, setSearch] = useState("");
  const [quantity, setQuantity] = useState("");

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const [editingQuantity, setEditingQuantity] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const searchInputRef = useRef<HTMLInputElement>(null);

  const quantityInputRef = useRef<HTMLInputElement>(null);

  /* =========================================================
     FETCH DATA
  ========================================================= */

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    const fetchData = async () => {
      try {
        console.log("API_URL:", JSON.stringify(API_URL));
        console.log("PRODUCT URL:", JSON.stringify(`${API_URL}/api/products`));
        console.log("STOCK URL:", JSON.stringify(`${API_URL}/api/stocks`));
        console.log("MUTATION URL:", JSON.stringify(`${API_URL}/api/mutation`));
        const [productsResponse, stockResponse, requestsResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/products`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_URL}/api/stocks`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_URL}/api/mutation`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        if (!productsResponse.ok || !stockResponse.ok || !requestsResponse.ok) {
          throw new Error("Gagal mengambil data.");
        }

        const productsData = await productsResponse.json();

        const stockDataResponse = await stockResponse.json();

        const requestsData = await requestsResponse.json();

        setProducts(productsData);

        setStockData(stockDataResponse);

        /*
         * Hanya tampilkan request yang masih REQUESTED.
         *
         * COMPLETED tidak ditampilkan.
         */
        setMutationRequests(
          (requestsData.data || []).filter(
            (request: MutationRequest) => request.status === "REQUESTED",
          ),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* =========================================================
     FILTER PRODUCT
  ========================================================= */

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.kodeBarang.toLowerCase().includes(keyword) ||
        product.category.name.toLowerCase().includes(keyword),
    );
  }, [products, search]);

  /* =========================================================
     GET STOCK
  ========================================================= */

  const getStockByLocation = (
    productId: number,
    locationName: string,
  ): number => {
    const stock = stockData.find(
      (item) =>
        item.productId === productId &&
        item.location.name.toUpperCase() === locationName.toUpperCase(),
    );

    return stock ? stock.quantity : 0;
  };

  /* =========================================================
     SELECT PRODUCT
  ========================================================= */

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);

    setSearch(`${product.kodeBarang} - ${product.name} `);

    setQuantity("");

    setError("");

    setShowProductDropdown(false);

    setTimeout(() => {
      quantityInputRef.current?.focus();
    }, 0);
  };

  /* =========================================================
     ADD ITEM
  ========================================================= */

  const handleAddItem = () => {
    if (!selectedProduct) {
      setError("Silakan pilih barang terlebih dahulu.");

      return;
    }

    const requestedQuantity = Number(quantity);

    if (
      !quantity ||
      requestedQuantity <= 0 ||
      !Number.isInteger(requestedQuantity)
    ) {
      setError("Jumlah harus berupa angka bulat lebih dari 0.");

      return;
    }

    const existingItem = requestItems.find(
      (item) => item.product.id === selectedProduct.id,
    );

    if (existingItem) {
      const totalQuantity = existingItem.quantity + requestedQuantity;

      setRequestItems(
        requestItems.map((item) =>
          item.product.id === selectedProduct.id
            ? {
                ...item,
                quantity: totalQuantity,
              }
            : item,
        ),
      );
    } else {
      setRequestItems([
        ...requestItems,
        {
          product: selectedProduct,
          quantity: requestedQuantity,
        },
      ]);
    }

    setSelectedProduct(null);

    setSearch("");

    setQuantity("");

    setError("");

    setShowProductDropdown(false);
  };

  /* =========================================================
     REMOVE ITEM
  ========================================================= */

  const handleRemoveItem = (productId: number) => {
    setRequestItems(
      requestItems.filter((item) => item.product.id !== productId),
    );

    if (editingProductId === productId) {
      setEditingProductId(null);

      setEditingQuantity("");
    }
  };

  /* =========================================================
     EDIT ITEM
  ========================================================= */

  const handleEditItem = (item: RequestItem) => {
    setEditingProductId(item.product.id);

    setEditingQuantity(String(item.quantity));

    setError("");
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);

    setEditingQuantity("");
  };

  const handleSaveEdit = (productId: number) => {
    const newQuantity = Number(editingQuantity);

    if (
      !editingQuantity ||
      newQuantity <= 0 ||
      !Number.isInteger(newQuantity)
    ) {
      setError("Jumlah harus berupa angka bulat lebih dari 0.");

      return;
    }

    setRequestItems(
      requestItems.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item,
      ),
    );

    setEditingProductId(null);

    setEditingQuantity("");

    setError("");
  };

  /* =========================================================
     REFRESH REQUEST HISTORY
  ========================================================= */

  const refreshMutationRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }
      const response = await fetch(`${API_URL}/api/mutation`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Gagal mengambil data request.");
      }
      const data = await response.json();
      setMutationRequests(
        (data.data || []).filter(
          (request: MutationRequest) => request.status === "REQUESTED",
        ),
      );
    } catch (error) {
      console.error("REFRESH REQUEST ERROR:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshMutationRequests();
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  /* =========================================================
     SUBMIT REQUEST
  ========================================================= */

  const handleSubmitRequest = async () => {
    if (requestItems.length === 0) {
      setError("Belum ada barang yang di-request.");
      return;
    }
    try {
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }
      const response = await fetch(`${API_URL}/api/mutation`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: null,
          items: requestItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Gagal mengirim request barang.");
      }
      /* ========================================= REQUEST BERHASIL ========================================= */ setSuccess(
        data.message || "Request barang berhasil dibuat.",
      );
      setTimeout(() => {
        setSuccess("");
      }, 2500);
      /* ========================================= KOSONGKAN FORM ========================================= */ setRequestItems(
        [],
      );
      /* ========================================= LANGSUNG AMBIL REQUEST TERBARU ========================================= */ await refreshMutationRequests();
    } catch (error) {
      console.error("SUBMIT REQUEST ERROR:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengirim request barang.",
      );
    }
  };

  /* =========================================================
     SEARCH ENTER
  ========================================================= */

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    if (selectedProduct) {
      quantityInputRef.current?.focus();

      return;
    }

    if (filteredProducts.length > 0) {
      handleSelectProduct(filteredProducts[0]);
    } else {
      setError("Barang tidak ditemukan.");
    }
  };

  /* =========================================================
     QUANTITY ENTER
  ========================================================= */

  const handleQuantityKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    if (!selectedProduct) {
      return;
    }

    handleAddItem();
  };

  /* =========================================================
     EDITING QUANTITY KEYBOARD
  ========================================================= */

  const handleEditingQuantityKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    productId: number,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();

      handleSaveEdit(productId);
    }

    if (event.key === "Escape") {
      event.preventDefault();

      handleCancelEdit();
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <>
        <Navbar showBack />

        <div className="request-container">
          <div className="loading-state">Memuat data...</div>
        </div>
      </>
    );
  }

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <>
      <Navbar showBack />

      {/* SUCCESS TOAST */}
      {success && (
        <div className="request-success-toast">
          <div className="request-success-icon">✓</div>

          <div className="request-success-content">
            <strong>Request Berhasil</strong>

            <span>{success}</span>
          </div>
        </div>
      )}

      <div className="request-container">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="request-header">
          <div>
            <p className="page-greeting">Toko 📦</p>

            <h1>Request Barang</h1>

            <p>Request barang dari dapur untuk kebutuhan toko.</p>
          </div>
        </div>

        {/* ERROR */}

        {error && <div className="error-message">{error}</div>}

        {/* =====================================================
            FORM REQUEST
        ===================================================== */}

        <div className="request-form-section">
          <div className="section-header">
            <div>
              <h2>Tambah Barang</h2>

              <p>Pilih barang dan masukkan jumlah yang ingin di-request.</p>
            </div>
          </div>

          <div className="input-fields-row">
            {/* BARANG */}

            <div className="input-group">
              <label>Barang</label>

              <div className="search-input-wrapper">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Cari nama atau kode barang..."
                  value={search}
                  onFocus={() => setShowProductDropdown(true)}
                  onChange={(event) => {
                    setSearch(event.target.value);

                    setSelectedProduct(null);

                    setError("");

                    setShowProductDropdown(true);
                  }}
                  onKeyDown={handleSearchKeyDown}
                />

                <button
                  type="button"
                  className="product-dropdown-button"
                  onClick={() => setShowProductDropdown((prev) => !prev)}
                  title="Tampilkan semua barang"
                >
                  ▼
                </button>

                {/* PRODUCT DROPDOWN */}

                {showProductDropdown && (
                  <div className="product-dropdown">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="product-option"
                          onMouseDown={(event) => {
                            event.preventDefault();

                            handleSelectProduct(product);
                          }}
                        >
                          <div>
                            <strong>{product.name}</strong>

                            <span>
                              {product.kodeBarang} • {product.category.name}
                            </span>
                          </div>

                          <div className="product-stock-info">
                            <span>
                              Toko:{" "}
                              <strong>
                                {getStockByLocation(product.id, "TOKO")}
                              </strong>
                            </span>

                            <span>
                              Dapur:{" "}
                              <strong>
                                {getStockByLocation(product.id, "DAPUR")}
                              </strong>
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-product">Barang tidak ditemukan.</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* JUMLAH */}

            <div className="input-group">
              <label>Jumlah</label>

              <input
                ref={quantityInputRef}
                type="number"
                min="1"
                placeholder="Masukkan jumlah"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                onKeyDown={handleQuantityKeyDown}
                disabled={!selectedProduct}
              />
            </div>

            {/* TAMBAH */}

            <button
              className="add-item-button"
              onClick={handleAddItem}
              disabled={!selectedProduct}
            >
              + Tambah
            </button>
          </div>

          {/* ===================================================
              SELECTED PRODUCT
          =================================================== */}

          {selectedProduct && (
            <div className="selected-product">
              <div className="selected-product-icon">📦</div>

              <div className="selected-product-main">
                <div className="selected-product-info">
                  <strong>{selectedProduct.name}</strong>

                  <span>
                    {selectedProduct.kodeBarang} • {selectedProduct.unit.symbol}
                  </span>
                </div>

                <div className="selected-product-stock">
                  <div className="stock-info-box">
                    <span>Stok Toko</span>

                    <strong>
                      {getStockByLocation(selectedProduct.id, "TOKO")} pcs
                    </strong>
                  </div>

                  <div className="stock-info-box">
                    <span>Stok Dapur</span>

                    <strong>
                      {getStockByLocation(selectedProduct.id, "DAPUR")} pcs
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =====================================================
            DAFTAR REQUEST BARU
        ===================================================== */}

        <div className="request-list-section">
          <div className="section-header">
            <div>
              <h2>Daftar Request</h2>

              <p>Barang yang akan di-request ke dapur.</p>
            </div>

            <span className="request-count">{requestItems.length} Barang</span>
          </div>

          {requestItems.length > 0 ? (
            <div className="request-table-wrapper">
              <table className="request-table">
                <thead>
                  <tr>
                    <th>KODE BARANG</th>

                    <th>PRODUK</th>

                    <th>STOK TOKO</th>

                    <th>STOK DAPUR</th>

                    <th>REQUEST</th>

                    <th>AKSI</th>
                  </tr>
                </thead>

                <tbody>
                  {requestItems.map((item) => (
                    <tr key={item.product.id}>
                      <td>
                        <span className="item-code">
                          {item.product.kodeBarang}
                        </span>
                      </td>

                      <td>
                        <div className="item-name">
                          <span className="item-icon">📦</span>

                          <div>
                            <strong>{item.product.name}</strong>

                            <span>{item.product.category.name}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="stock-value">
                          {getStockByLocation(item.product.id, "TOKO")} pcs
                        </span>
                      </td>

                      <td>
                        <span className="stock-value">
                          {getStockByLocation(item.product.id, "DAPUR")} pcs
                        </span>
                      </td>

                      <td>
                        {editingProductId === item.product.id ? (
                          <input
                            type="number"
                            min="1"
                            value={editingQuantity}
                            onChange={(event) =>
                              setEditingQuantity(event.target.value)
                            }
                            onKeyDown={(event) =>
                              handleEditingQuantityKeyDown(
                                event,
                                item.product.id,
                              )
                            }
                            autoFocus
                            className="editing-quantity-input"
                          />
                        ) : (
                          <strong>
                            {item.quantity} {item.product.unit.symbol}
                          </strong>
                        )}
                      </td>

                      <td>
                        <div className="request-action-buttons">
                          {editingProductId === item.product.id ? (
                            <>
                              <button
                                type="button"
                                className="edit-button"
                                onClick={() => handleSaveEdit(item.product.id)}
                              >
                                Simpan
                              </button>

                              <button
                                type="button"
                                className="cancel-button"
                                onClick={handleCancelEdit}
                              >
                                Batal
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="edit-button"
                                onClick={() => handleEditItem(item)}
                                title="Edit jumlah"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="delete-x-button"
                                onClick={() =>
                                  handleRemoveItem(item.product.id)
                                }
                                title="Hapus barang"
                              >
                                ×
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div>📦</div>

              <h3>Belum ada barang</h3>

              <p>Tambahkan barang yang ingin di-request dari dapur.</p>
            </div>
          )}
        </div>

        {/* =====================================================
            HISTORY REQUEST YANG MASIH AKTIF
        ===================================================== */}

        {mutationRequests.length > 0 && (
          <section className="request-section">
            {" "}
            <div className="section-header">
              {" "}
              <div>
                {" "}
                <h2>Request Sedang Diproses</h2>{" "}
                <p> Request yang masih menunggu diproses oleh dapur. </p>{" "}
              </div>{" "}
              <div className="stock-count">
                {" "}
                {mutationRequests.length} request{" "}
              </div>{" "}
            </div>{" "}
            <div className="request-list">
              {" "}
              {mutationRequests.map((request) => (
                <div className="request-card" key={request.id}>
                  {" "}
                  {/* REQUEST HEADER */}{" "}
                  <div className="request-card-header">
                    {" "}
                    <div>
                      {" "}
                      <span className="request-number">
                        {" "}
                        {request.requestNumber}{" "}
                      </span>{" "}
                      <h3> Request ke Dapur </h3>{" "}
                    </div>{" "}
                    <span className="request-status">
                      {" "}
                      Menunggu Dapur{" "}
                    </span>{" "}
                  </div>{" "}
                  {/* REQUEST ITEMS */}{" "}
                  <div className="request-items">
                    {" "}
                    {request.items.map((item) => (
                      <div className="request-item" key={item.id}>
                        {" "}
                        <div>
                          {" "}
                          <strong> {item.product.name} </strong>{" "}
                          <span> {item.product.kodeBarang} </span>{" "}
                        </div>{" "}
                        <div className="request-quantity">
                          {" "}
                          <div className="request-info-box">
                            {" "}
                            <span className="info-box-label">
                              {" "}
                              Request{" "}
                            </span>{" "}
                            <strong className="info-box-value">
                              {" "}
                              {item.quantity}{" "}
                              <span> {item.product.unit.symbol} </span>{" "}
                            </strong>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>
                    ))}{" "}
                  </div>{" "}
                  {/* FOOTER */}{" "}
                  <div className="request-card-footer">
                    {" "}
                    <span> TOKO → DAPUR </span>{" "}
                    <span> Menunggu diproses </span>{" "}
                  </div>{" "}
                </div>
              ))}{" "}
            </div>{" "}
          </section>
        )}

        {/* =====================================================
            SUBMIT REQUEST
        ===================================================== */}

        {requestItems.length > 0 && (
          <div className="request-submit-section">
            <div>
              <strong>{requestItems.length} barang siap di-request</strong>

              <p>Pastikan jumlah barang sudah sesuai sebelum dikirim.</p>
            </div>

            <button
              className="submit-request-button"
              onClick={handleSubmitRequest}
            >
              Kirim Request
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default RequestBarangToko;
