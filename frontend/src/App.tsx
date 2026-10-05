import Login from "./pages/Login";
import DashboardDapur from "./pages/DashboardDapur";
import DashboardToko from "./pages/DashboardToko";
import TambahStokDapur from "./pages/TambahStokDapur";
import RequestBarang from "./pages/RequestBarang";
import Kasir from "./pages/Kasir";
import DashboardOwner from "./pages/DashboardOwner";

function App() {
  const path = window.location.pathname;

  if (path === "/dashboard-dapur/tambah-stok") {
    return <TambahStokDapur />;
  }

  if (path === "/dashboard-dapur") {
    return <DashboardDapur />;
  }

  if (path === "/dashboard-toko") {
    return <DashboardToko />;
  }

  if (path === "/dashboard-toko/request-barang") {
    return <RequestBarang />;
  }

  if (path === "/dashboard-toko/kasir") {
    return <Kasir />;
  }

  if (path === "/dashboard-owner") {
    return <DashboardOwner />;
  }

  return <Login />;
}

export default App;