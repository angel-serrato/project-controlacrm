import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function PrivateLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900">ControlaCRM</h2>
        </div>

        <nav className="mt-8">
          <ul className="space-y-2 px-4">
            <li>
              <Link
                to="/dashboard"
                className="block px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/contacts"
                className="block px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                Contacts
              </Link>
            </li>
          </ul>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 w-64 border-t border-gray-200 p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600">Logged as:</p>
            <p className="font-semibold text-gray-900">
              {user?.email || "User"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-xl font-semibold text-gray-900">Welcome</h1>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default PrivateLayout;
