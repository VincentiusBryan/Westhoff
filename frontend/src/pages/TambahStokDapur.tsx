import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import Navbar from "../components/Navbar";
import "../css/TambahStokDapur.css";
import { API_URL } from "../config/api";

interface Product {
  id: number;
  kodeBarang: string;
  name: string;
  isActive: boolean;

  category?: {
    id: number;
    name: string;
  };

  unit?: {
    id: number;
    name: string;
    symbol: string;
  };
}

interface Location {
  id: number;
  name: string;
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

interface ProductionItem {
  productId: number;
  kodeBarang: string;
  name: string;
  quantity: number;
  currentStock: number;
  unit: string;
  category: string;
}

function TambahStokDapur() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [locations, setLocations] =
    useState<Location[]>([]);

  const [stocks, setStocks] =
    useState<Stock[]>([]);

  const [productId, setProductId] =
    useState<string>("");

  const [productSearch, setProductSearch] =
    useState<string>("");

  const [showProductResults, setShowProductResults] =
    useState<boolean>(false);

  const [quantity, setQuantity] =
    useState<string>("");

  const [items, setItems] =
    useState<ProductionItem[]>([]);

  const [editingIndex, setEditingIndex] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [saving, setSaving] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string>("");

  const [success, setSuccess] =
    useState<string>("");

  const productInputRef =
    useRef<HTMLInputElement>(null);

  const quantityInputRef =
    useRef<HTMLInputElement>(null);

  const token =
    localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          window.location.href = "/";
          return;
        }

        const productsResponse =
          await fetch(
            `${API_URL}/api/products`,
            {
              method: "GET",
              headers: {
                Authorization:
                  `Bearer ${token}`,
                "Content-Type":
                  "application/json",
              },
            }
          );

        const productsData =
          await productsResponse.json();

        if (!productsResponse.ok) {
          throw new Error(
            productsData.message ||
              "Gagal mengambil data produk."
          );
        }

        if (!Array.isArray(productsData)) {
          throw new Error(
            "Format data produk tidak valid."
          );
        }

        const activeProducts =
          productsData.filter(
            (product: Product) =>
              product.isActive !== false
          );

        setProducts(activeProducts);

        const locationsResponse =
          await fetch(
            `${API_URL}/api/locations`,
            {
              method: "GET",
              headers: {
                Authorization:
                  `Bearer ${token}`,
                "Content-Type":
                  "application/json",
              },
            }
          );

        const locationsData =
          await locationsResponse.json();

        if (!locationsResponse.ok) {
          throw new Error(
            locationsData.message ||
              "Gagal mengambil data lokasi."
          );
        }

        if (!Array.isArray(locationsData)) {
          throw new Error(
            "Format data lokasi tidak valid."
          );
        }

        setLocations(locationsData);

        const stocksResponse =
          await fetch(
            `${API_URL}/api/stocks`,
            {
              method: "GET",
              headers: {
                Authorization:
                  `Bearer ${token}`,
                "Content-Type":
                  "application/json",
              },
            }
          );

        const stocksData =
          await stocksResponse.json();

        if (!stocksResponse.ok) {
          throw new Error(
            stocksData.message ||
              "Gagal mengambil data stok."
          );
        }

        if (!Array.isArray(stocksData)) {
          throw new Error(
            "Format data stok tidak valid."
          );
        }

        setStocks(stocksData);
      } catch (error) {
        console.error(
          "FETCH DATA ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const dapurLocation =
    locations.find(
      (location) =>
        location.name
          ?.trim()
          .toUpperCase() === "DAPUR"
    );

  const selectedProduct =
    products.find(
      (product) =>
        Number(product.id) ===
        Number(productId)
    );

  const currentStock =
    selectedProduct
      ? stocks
          .filter(
            (stock) =>
              Number(stock.productId) ===
                Number(selectedProduct.id) &&
              (
                (
                  dapurLocation &&
                  Number(stock.locationId) ===
                    Number(dapurLocation.id)
                ) ||
                stock.location?.name
                  ?.trim()
                  .toUpperCase() ===
                  "DAPUR"
              )
          )
          .reduce(
            (total, stock) =>
              total +
              Number(stock.quantity || 0),
            0
          )
      : 0;

  const filteredProducts =
    products.filter((product) => {
      const keyword =
        productSearch
          .trim()
          .toLowerCase();

      if (!keyword) {
        return false;
      }

      return (
        product.name
          .toLowerCase()
          .includes(keyword) ||
        product.kodeBarang
          .toLowerCase()
          .includes(keyword) ||
        product.category?.name
          ?.toLowerCase()
          .includes(keyword)
      );
    });

  const handleProductSearch = (
    value: string
  ) => {
    setProductSearch(value);
    setShowProductResults(true);
    setError("");
    setSuccess("");

    if (!value.trim()) {
      setProductId("");
      setQuantity("");
      setEditingIndex(null);
    }
  };

  const handleSelectProduct = (
    product: Product
  ) => {
    setProductId(
      String(product.id)
    );

    setProductSearch(
      `${product.kodeBarang} - ${product.name}`
    );

    setShowProductResults(false);
    setError("");
    setSuccess("");

    if (editingIndex === null) {
      setQuantity("");
    }

    setTimeout(() => {
      quantityInputRef.current?.focus();
    }, 0);
  };

  const handleProductKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key !== "Enter") {
      return;
    }

    e.preventDefault();

    if (!productSearch.trim()) {
      setError(
        "Silakan masukkan nama atau kode barang."
      );
      return;
    }

    if (filteredProducts.length === 0) {
      setError(
        "Barang tidak ditemukan."
      );
      return;
    }

    const keyword =
      productSearch
        .trim()
        .toLowerCase();

    const exactProduct =
      products.find(
        (product) =>
          product.name
            .toLowerCase() ===
            keyword ||
          product.kodeBarang
            .toLowerCase() ===
            keyword
      );

    handleSelectProduct(
      exactProduct ||
        filteredProducts[0]
    );
  };

  const handleAddItem = () => {
    setError("");
    setSuccess("");

    if (!selectedProduct) {
      setError(
        "Silakan pilih barang terlebih dahulu."
      );
      return;
    }

    if (
      !quantity ||
      Number(quantity) <= 0
    ) {
      setError(
        "Jumlah produksi harus lebih dari 0."
      );
      return;
    }

    if (!dapurLocation) {
      setError(
        "Lokasi DAPUR tidak ditemukan."
      );
      return;
    }

    const quantityNumber =
      Number(quantity);

    if (editingIndex !== null) {
      const updatedItems =
        [...items];

      updatedItems[editingIndex] = {
        ...updatedItems[editingIndex],

        productId:
          selectedProduct.id,

        kodeBarang:
          selectedProduct.kodeBarang,

        name:
          selectedProduct.name,

        quantity:
          quantityNumber,

        currentStock:
          currentStock,

        unit:
          selectedProduct.unit
            ?.symbol ||
          "unit",

        category:
          selectedProduct.category
            ?.name ||
          "-",
      };

      setItems(updatedItems);
      setEditingIndex(null);
    } else {
      const existingIndex =
        items.findIndex(
          (item) =>
            Number(item.productId) ===
            Number(selectedProduct.id)
        );

      if (existingIndex !== -1) {
        const updatedItems =
          [...items];

        updatedItems[
          existingIndex
        ] = {
          ...updatedItems[
            existingIndex
          ],

          quantity:
            updatedItems[
              existingIndex
            ].quantity +
            quantityNumber,

          currentStock:
            currentStock,
        };

        setItems(updatedItems);
      } else {
        const newItem: ProductionItem =
          {
            productId:
              selectedProduct.id,

            kodeBarang:
              selectedProduct.kodeBarang,

            name:
              selectedProduct.name,

            quantity:
              quantityNumber,

            currentStock:
              currentStock,

            unit:
              selectedProduct.unit
                ?.symbol ||
              "unit",

            category:
              selectedProduct.category
                ?.name ||
              "-",
          };

        setItems([
          ...items,
          newItem,
        ]);
      }
    }

    setProductId("");
    setProductSearch("");
    setQuantity("");
    setShowProductResults(false);

    setTimeout(() => {
      productInputRef.current?.focus();
    }, 0);
  };

  const handleEditItem = (
    index: number
  ) => {
    const item = items[index];

    setEditingIndex(index);

    setProductId(
      String(item.productId)
    );

    setProductSearch(
      `${item.kodeBarang} - ${item.name}`
    );

    setQuantity(
      String(item.quantity)
    );

    setShowProductResults(false);

    setError("");
    setSuccess("");

    setTimeout(() => {
      quantityInputRef.current?.focus();
    }, 0);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setProductId("");
    setProductSearch("");
    setQuantity("");
    setShowProductResults(false);
    setError("");
    setSuccess("");

    setTimeout(() => {
      productInputRef.current?.focus();
    }, 0);
  };

  const handleQuantityKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem();
    }
  };

  const handleRemoveItem = (
    index: number
  ) => {
    const updatedItems =
      items.filter(
        (_, itemIndex) =>
          itemIndex !== index
      );

    setItems(updatedItems);

    if (editingIndex === index) {
      setEditingIndex(null);
      setProductId("");
      setProductSearch("");
      setQuantity("");
    } else if (
      editingIndex !== null &&
      index < editingIndex
    ) {
      setEditingIndex(
        editingIndex - 1
      );
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (editingIndex !== null) {
      setError(
        "Selesaikan edit barang terlebih dahulu."
      );
      return;
    }

    if (items.length === 0) {
      setError(
        "Minimal 1 barang harus dimasukkan."
      );
      return;
    }

    if (!dapurLocation) {
      setError(
        "Lokasi DAPUR tidak ditemukan."
      );
      return;
    }

    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      setSaving(true);

      const transactionNumber =
        `PROD-${Date.now()}`;

      const response =
        await fetch(
          `${API_URL}/api/transactions`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              transactionNumber,

              type:
                "PRODUKSI",

              toLocationId:
                dapurLocation.id,

              notes:
                "Produksi stok dapur",

              items:
                items.map(
                  (item) => ({
                    productId:
                      item.productId,

                    quantity:
                      item.quantity,
                  })
                ),
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Gagal menyimpan produksi."
        );
      }

      setSuccess(
        "Produksi berhasil disimpan dan stok berhasil ditambahkan."
      );

      setItems([]);

      setProductId("");
      setProductSearch("");
      setQuantity("");
      setEditingIndex(null);
      setShowProductResults(false);

      const stocksResponse =
        await fetch(
          `${API_URL}/api/stocks`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      const stocksData =
        await stocksResponse.json();

      if (
        stocksResponse.ok &&
        Array.isArray(stocksData)
      ) {
        setStocks(stocksData);
      }

      setTimeout(() => {
        setSuccess("");
        productInputRef.current?.focus();
      }, 2500);
    } catch (error) {
      console.error(
        "SAVE PRODUCTION ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan produksi."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="tambah-stock-page">
        <Navbar showBack={true} />

        <div className="page-loading">
          <div className="loading-spinner"></div>

          <h3>
            Memuat data...
          </h3>

          <p>
            Sedang mengambil data
            produk, lokasi, dan stok.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tambah-stock-page">
      <Navbar showBack={true} />

      {success && (
        <div className="production-success-toast">
          <div className="production-success-icon">
            ✓
          </div>

          <div className="production-success-content">
            <strong>
              Produksi Berhasil
            </strong>

            <span>
              {success}
            </span>
          </div>
        </div>
      )}

      <main
        className="stock-workspace"
        style={{
          display: "block",
          width: "100%",
        }}
      >
        <section
          className="input-panel"
          style={{
            width: "100%",
            maxWidth: "none",
            minHeight:
              "calc(100vh - 80px)",
            borderRadius: 0,
          }}
        >
          <div className="panel-heading">
            <span className="panel-label">
              PRODUKSI DAPUR
            </span>

            <h1>
              Tambah Stok
            </h1>

            <p>
              Masukkan beberapa barang
              sekaligus untuk produksi.
            </p>
          </div>

          {error && (
            <div className="form-error">
              <div className="error-icon">
                !
              </div>

              <span>
                {error}
              </span>
            </div>
          )}

          {editingIndex !== null && (
            <div className="editing-notice">
              <div className="editing-notice-icon">
                ✎
              </div>

              <div>
                <strong>
                  Sedang mengedit barang
                </strong>

                <span>
                  Ubah jumlah produksi lalu tekan
                  Update Barang.
                </span>
              </div>

              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                Batal Edit
              </button>
            </div>
          )}

          <div className="input-fields-row">
            <div className="input-section product-input-section">
              <label htmlFor="product-search">
                Barang
                <span>*</span>
              </label>

              <div className="product-search-wrapper">
                <div
                  className={`product-search-box ${
                    showProductResults &&
                    productSearch
                      ? "is-active"
                      : ""
                  }`}
                >
                  <span className="search-icon">
                    🔍
                  </span>

                  <input
                    ref={productInputRef}
                    id="product-search"
                    type="text"
                    placeholder="Ketik nama atau kode barang..."
                    value={productSearch}
                    onChange={(e) =>
                      handleProductSearch(
                        e.target.value
                      )
                    }
                    onKeyDown={
                      handleProductKeyDown
                    }
                    onFocus={() => {
                      if (
                        productSearch.trim()
                      ) {
                        setShowProductResults(
                          true
                        );
                      }
                    }}
                    disabled={saving}
                    autoComplete="off"
                    autoFocus
                  />

                  {productSearch && (
                    <button
                      type="button"
                      className="clear-search"
                      onClick={() => {
                        setProductSearch("");
                        setProductId("");
                        setQuantity("");
                        setShowProductResults(
                          false
                        );
                      }}
                      disabled={saving}
                    >
                      ×
                    </button>
                  )}
                </div>

                {showProductResults &&
                  productSearch.trim() && (
                    <div className="product-results">
                      {filteredProducts.length >
                      0 ? (
                        filteredProducts
                          .slice(0, 8)
                          .map(
                            (product) => (
                              <button
                                type="button"
                                key={
                                  product.id
                                }
                                className="product-result-item"
                                onClick={() =>
                                  handleSelectProduct(
                                    product
                                  )
                                }
                              >
                                <div className="result-icon">
                                  🧁
                                </div>

                                <div className="result-info">
                                  <strong>
                                    {
                                      product.name
                                    }
                                  </strong>

                                  <span>
                                    {
                                      product.kodeBarang
                                    }

                                    {product
                                      .category
                                      ?.name
                                      ? ` • ${product.category.name}`
                                      : ""}
                                  </span>
                                </div>

                                <span className="result-arrow">
                                  →
                                </span>
                              </button>
                            )
                          )
                      ) : (
                        <div className="no-product-result">
                          <span>
                            🔎
                          </span>

                          <div>
                            <strong>
                              Barang tidak ditemukan
                            </strong>

                            <p>
                              Coba nama atau
                              kode barang
                              lain.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
              </div>

              <small>
                Ketik nama, kode barang,
                atau kategori. Tekan Enter untuk
                memilih barang.
              </small>
            </div>

            <div className="input-section quantity-input-section">
              <label htmlFor="quantity">
                Jumlah Produksi
                <span>*</span>
              </label>

              <div className="quantity-field">
                <input
                  ref={quantityInputRef}
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      e.target.value
                    )
                  }
                  onKeyDown={
                    handleQuantityKeyDown
                  }
                  disabled={
                    saving ||
                    !selectedProduct
                  }
                />

                <span>
                  {selectedProduct?.unit
                    ?.symbol ||
                    "unit"}
                </span>
              </div>

              <small>
                Tekan Enter untuk menambahkan
                barang ke daftar.
              </small>
            </div>
          </div>

          {selectedProduct && (
            <div className="selected-product-summary">
              <div className="selected-product-summary-info">
                <div className="selected-product-summary-icon">
                  🧁
                </div>

                <div>
                  <strong>
                    {
                      selectedProduct.name
                    }
                  </strong>

                  <span>
                    {
                      selectedProduct.kodeBarang
                    }
                  </span>
                </div>
              </div>

              <div className="current-stock-display">
                <span>
                  STOK SEKARANG
                </span>

                <strong>
                  {currentStock.toLocaleString(
                    "id-ID"
                  )}
                </strong>

                <small>
                  {selectedProduct.unit
                    ?.symbol ||
                    "unit"}{" "}
                  di DAPUR
                </small>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                if (
                  editingIndex !== null
                ) {
                  handleCancelEdit();
                  return;
                }

                window.location.href =
                  "/dashboard-dapur";
              }}
              disabled={saving}
            >
              {editingIndex !== null
                ? "Batal Edit"
                : "Batal"}
            </button>

            <button
              type="button"
              className="save-button"
              onClick={handleAddItem}
              disabled={
                saving ||
                !selectedProduct ||
                !quantity
              }
            >
              <span>
                {editingIndex !== null
                  ? "✓"
                  : "＋"}
              </span>

              {editingIndex !== null
                ? "Update Barang"
                : "Tambah Barang"}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="production-list">
              <div className="production-list-header">
                <div>
                  <span className="panel-label">
                    DAFTAR PRODUKSI
                  </span>

                  <h2>
                    Barang yang akan diproduksi
                  </h2>
                </div>

                <div className="item-count">
                  {items.length} barang
                </div>
              </div>

              {items.length === 0 ? (
                <div className="empty-production-list">
                  <div className="empty-product-icon">
                    🧁
                  </div>

                  <strong>
                    Belum ada barang
                  </strong>

                  <p>
                    Pilih barang dan masukkan
                    jumlah produksi di atas.
                  </p>
                </div>
              ) : (
                <div className="production-table-wrapper">
                  <table className="production-table">
                    <thead>
                      <tr>
                        <th>
                          BARANG
                        </th>

                        <th>
                          STOK SEKARANG
                        </th>

                        <th>
                          PRODUKSI
                        </th>

                        <th>
                          STOK SETELAH
                        </th>

                        <th>
                          AKSI
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.map(
                        (
                          item,
                          index
                        ) => (
                          <tr
                            key={`${item.productId}-${index}`}
                            className={
                              editingIndex ===
                              index
                                ? "editing-row"
                                : ""
                            }
                          >
                            <td>
                              <div className="production-product">
                                <div className="result-icon">
                                  🧁
                                </div>

                                <div>
                                  <strong>
                                    {
                                      item.name
                                    }
                                  </strong>

                                  <span>
                                    {
                                      item.kodeBarang
                                    }

                                    {item.category !==
                                    "-"
                                      ? ` • ${item.category}`
                                      : ""}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="table-stock">
                                <strong>
                                  {item.currentStock.toLocaleString(
                                    "id-ID"
                                  )}
                                </strong>

                                <span>
                                  {
                                    item.unit
                                  }
                                </span>
                              </div>
                            </td>

                            <td>
                              <div className="table-production">
                                <strong>
                                  +
                                  {item.quantity.toLocaleString(
                                    "id-ID"
                                  )}
                                </strong>

                                <span>
                                  {
                                    item.unit
                                  }
                                </span>
                              </div>
                            </td>

                            <td>
                              <div className="table-final-stock">
                                <strong>
                                  {(
                                    item.currentStock +
                                    item.quantity
                                  ).toLocaleString(
                                    "id-ID"
                                  )}
                                </strong>

                                <span>
                                  {
                                    item.unit
                                  }
                                </span>
                              </div>
                            </td>

                            <td>
                              <div className="item-actions">
                                <button
                                  type="button"
                                  className="edit-item-button"
                                  onClick={() =>
                                    handleEditItem(
                                      index
                                    )
                                  }
                                  disabled={
                                    saving
                                  }
                                  title="Edit barang"
                                >
                                  ✎
                                </button>

                                <button
                                  type="button"
                                  className="remove-item-button"
                                  onClick={() =>
                                    handleRemoveItem(
                                      index
                                    )
                                  }
                                  disabled={
                                    saving
                                  }
                                  title="Hapus barang"
                                >
                                  ×
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="production-summary">
                <button
                  type="submit"
                  className="save-production-button"
                  disabled={
                    saving ||
                    editingIndex !== null
                  }
                >
                  {saving ? (
                    <>
                      <span className="button-spinner"></span>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <span>
                        ✓
                      </span>

                      Simpan Produksi
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}

export default TambahStokDapur;