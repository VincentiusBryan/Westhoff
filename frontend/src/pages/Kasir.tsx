import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Navbar from "../components/Navbar";
import "../css/Kasir.css";
import { API_URL } from "../config/api";

interface Product {
  id: number;
  kodeBarang: string;
  name: string;
  isActive: boolean;
  unit: {
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
}

interface CartItem {
  productId: number;
  kodeBarang: string;
  name: string;
  quantity: number;
  stock: number;
  unit: string;
}

function Kasir() {
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);

  const [cart, setCart] = useState<CartItem[]>([]);

  const [searchProduct, setSearchProduct] = useState("");
  const [selectedProductId, setSelectedProductId] =
    useState("");

  const [quantity, setQuantity] = useState("");

  const [showProductDropdown, setShowProductDropdown] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [success, setSuccess] = useState("");
  const [notificationError, setNotificationError] =
    useState("");

  const searchInputRef =
    useRef<HTMLInputElement>(null);

  const quantityInputRef =
    useRef<HTMLInputElement>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        productsRes,
        locationsRes,
        stocksRes,
      ] = await Promise.all([
        fetch(`${API_URL}/api/products`, {
          headers,
        }),
        fetch(`${API_URL}/api/locations`, {
          headers,
        }),
        fetch(`${API_URL}/api/stocks`, {
          headers,
        }),
      ]);

      if (
        !productsRes.ok ||
        !locationsRes.ok ||
        !stocksRes.ok
      ) {
        throw new Error("Gagal mengambil data");
      }

      const productsData =
        await productsRes.json();

      const locationsData =
        await locationsRes.json();

      const stocksData =
        await stocksRes.json();

      setProducts(
        productsData.filter(
          (product: Product) =>
            product.isActive !== false
        )
      );

      setLocations(locationsData);
      setStocks(stocksData);
    } catch (error) {
      console.error(error);

      alert(
        "Gagal mengambil data produk dan stok"
      );
    } finally {
      setLoading(false);
    }
  };

  const tokoLocation = locations.find(
    (location) =>
      location.name.toUpperCase() === "TOKO"
  );

  const getStockForProduct = (
    productId: number
  ) => {
    if (!tokoLocation) {
      return 0;
    }

    const stock = stocks.find(
      (item) =>
        item.productId === productId &&
        item.locationId === tokoLocation.id
    );

    return stock?.quantity ?? 0;
  };

  const filteredProducts = useMemo(() => {
    const keyword = searchProduct
      .trim()
      .toLowerCase();

    if (!keyword) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name
          .toLowerCase()
          .includes(keyword) ||
        product.kodeBarang
          .toLowerCase()
          .includes(keyword)
    );
  }, [products, searchProduct]);

  const handleSelectProduct = (
    product: Product
  ) => {
    setSelectedProductId(
      String(product.id)
    );

    setSearchProduct(
      `${product.kodeBarang} - ${product.name}`
    );

    setShowProductDropdown(false);

    setTimeout(() => {
      quantityInputRef.current?.focus();
    }, 0);
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    if (filteredProducts.length === 0) {
      setNotificationError(
        "Barang tidak ditemukan"
      );

      setTimeout(() => {
        setNotificationError("");
      }, 2500);

      return;
    }

    const product = filteredProducts[0];

    handleSelectProduct(product);
  };

  const handleAddItem = () => {
    if (!selectedProductId) {
      setNotificationError(
        "Pilih barang terlebih dahulu"
      );

      setTimeout(() => {
        setNotificationError("");
      }, 2500);

      return;
    }

    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      setNotificationError(
        "Quantity harus lebih besar dari 0"
      );

      setTimeout(() => {
        setNotificationError("");
      }, 2500);

      return;
    }

    const product = products.find(
      (item) =>
        item.id ===
        Number(selectedProductId)
    );

    if (!product) {
      setNotificationError(
        "Produk tidak ditemukan"
      );

      setTimeout(() => {
        setNotificationError("");
      }, 2500);

      return;
    }

    const stock = getStockForProduct(
      product.id
    );

    if (stock <= 0) {
      setNotificationError(
        "Stok barang di TOKO kosong"
      );

      setTimeout(() => {
        setNotificationError("");
      }, 2500);

      return;
    }

    const existingItem = cart.find(
      (item) =>
        item.productId === product.id
    );

    const currentQuantity =
      existingItem
        ? existingItem.quantity
        : 0;

    if (
      currentQuantity + qty >
      stock
    ) {
      setNotificationError(
        `Stok tidak mencukupi. Stok TOKO: ${stock}`
      );

      setTimeout(() => {
        setNotificationError("");
      }, 2500);

      return;
    }

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + qty,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          kodeBarang:
            product.kodeBarang,
          name: product.name,
          quantity: qty,
          stock,
          unit: product.unit.symbol,
        },
      ]);
    }

    setSelectedProductId("");
    setSearchProduct("");
    setQuantity("");
    setShowProductDropdown(false);

    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  const handleQuantityKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    if (!selectedProductId) {
      return;
    }

    handleAddItem();
  };

  const handleRemoveItem = (
    productId: number
  ) => {
    setCart(
      cart.filter(
        (item) =>
          item.productId !== productId
      )
    );
  };

  const handleSubmit = async () => {
    if (cart.length === 0) {
      alert(
        "Belum ada barang yang dipilih"
      );
      return;
    }

    try {
      setSubmitting(true);

      const transactionNumber =
        `OUT-${Date.now()}`;

      const response = await fetch(
        `${API_URL}/api/transactions`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            transactionNumber,
            type: "PENGELUARAN",
            notes:
              "Pengeluaran barang dari TOKO",

            items: cart.map((item) => ({
              productId:
                item.productId,
              quantity:
                item.quantity,
            })),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Gagal membuat transaksi"
        );
      }

      setSuccess(
        "Pengeluaran barang berhasil"
      );

      setTimeout(() => {
        setSuccess("");
      }, 2500);

      setCart([]);
      setSelectedProductId("");
      setSearchProduct("");
      setQuantity("");

      await fetchData();

      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    } catch (error) {
      console.error(error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal membuat transaksi";

      if (
        errorMessage.startsWith(
          "Stok tidak mencukupi"
        )
      ) {
        setNotificationError(
          errorMessage
        );

        setTimeout(() => {
          setNotificationError("");
        }, 2500);
      } else {
        alert(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="kasir-page">
      <Navbar showBack={true} />

      {success && (
        <div className="kasir-success-toast">
          <div className="kasir-success-icon">
            ✓
          </div>

          <div className="kasir-success-content">
            <strong>Transaksi Berhasil</strong>

            <span>{success}</span>
          </div>
        </div>
      )}

      {notificationError && (
        <div className="kasir-error-toast">
          <div className="kasir-error-icon">
            !
          </div>

          <div className="kasir-error-content">
            <strong>Transaksi Gagal</strong>

            <span>{notificationError}</span>
          </div>
        </div>
      )}

      <main className="kasir-content">

        <div className="kasir-header">
          <h1>Kasir</h1>

          <p>
            Kelola pengeluaran barang
            kepada pelanggan.
          </p>
        </div>

        <div className="kasir-card">

          <h2>Transaksi Baru</h2>

          {loading ? (
            <p>Memuat data...</p>
          ) : (
            <>

              <div className="kasir-form">

                <div className="form-group">
                  <label>
                    Barang
                  </label>

                  <div className="product-search-wrapper">

                    <input
  ref={searchInputRef}
  type="text"
  value={searchProduct}
  placeholder="Cari nama atau kode barang..."
  onFocus={() => {
    if (searchProduct) {
      setShowProductDropdown(true);
    }
  }}
  onClick={() => {
    setShowProductDropdown(true);
  }}
  onChange={(e) => {
    setSearchProduct(e.target.value);
    setSelectedProductId("");
    setShowProductDropdown(true);
  }}
  onKeyDown={handleSearchKeyDown}
/>

                    <button
                      type="button"
                      className="product-dropdown-button"
                      onClick={() =>
                        setShowProductDropdown(
                          (prev) =>
                            !prev
                        )
                      }
                    >
                      ▼
                    </button>

                    {showProductDropdown && (
                      <div className="product-dropdown">

                        {filteredProducts.length >
                        0 ? (
                          filteredProducts.map(
                            (product) => {
                              const stock =
                                getStockForProduct(
                                  product.id
                                );

                              return (
                                <div
                                  key={
                                    product.id
                                  }
                                  className="product-option"
                                  onMouseDown={(
                                    event
                                  ) => {
                                    event.preventDefault();

                                    handleSelectProduct(
                                      product
                                    );
                                  }}
                                >

                                  <div className="product-option-info">

                                    <strong>
                                      {
                                        product.name
                                      }
                                    </strong>

                                    <span>
                                      {
                                        product.kodeBarang
                                      }
                                    </span>

                                  </div>

                                  <div className="product-option-stock">
                                    Stok:{" "}
                                    <strong>
                                      {
                                        stock
                                      }
                                    </strong>
                                  </div>

                                </div>
                              );
                            }
                          )
                        ) : (
                          <div className="no-product">
                            Barang tidak
                            ditemukan.
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                </div>

                <div className="form-group">

                  <label>
                    Jumlah
                  </label>

                  <input
                    ref={
                      quantityInputRef
                    }
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        e.target.value
                      )
                    }
                    onKeyDown={
                      handleQuantityKeyDown
                    }
                    placeholder="Masukkan jumlah"
                    disabled={
                      !selectedProductId
                    }
                  />

                </div>

                <button
                  type="button"
                  onClick={
                    handleAddItem
                  }
                  className="btn-add"
                  disabled={
                    !selectedProductId
                  }
                >
                  Tambah Barang Keluar
                </button>

              </div>

              <div className="cart-section">

                <h3>
                  Barang Keluar
                </h3>

                {cart.length ===
                0 ? (
                  <p className="empty-cart">
                    Belum ada barang.
                  </p>
                ) : (
                  <>

                    <div className="cart-table-wrapper">

                      <table className="cart-table">

                        <thead>
                          <tr>
                            <th>
                              Kode
                            </th>

                            <th>
                              Barang
                            </th>

                            <th>
                              Jumlah
                            </th>

                            <th>
                              Aksi
                            </th>
                          </tr>
                        </thead>

                        <tbody>

                          {cart.map(
                            (item) => (
                              <tr
                                key={
                                  item.productId
                                }
                              >

                                <td>
                                  {
                                    item.kodeBarang
                                  }
                                </td>

                                <td>
                                  {
                                    item.name
                                  }
                                </td>

                                <td>
                                  {
                                    item.quantity
                                  }{" "}
                                  {
                                    item.unit
                                  }
                                </td>

                                <td>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveItem(
                                        item.productId
                                      )
                                    }
                                    className="btn-remove"
                                  >
                                    Hapus
                                  </button>

                                </td>

                              </tr>
                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                    <button
                      type="button"
                      onClick={
                        handleSubmit
                      }
                      disabled={
                        submitting
                      }
                      className="btn-submit"
                    >
                      {submitting
                        ? "Memproses..."
                        : "Simpan Pengeluaran"}
                    </button>

                  </>
                )}

              </div>

            </>
          )}

        </div>

      </main>
    </div>
  );
}

export default Kasir;