import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import "./index.css";
import Profile from "./pages/profile/Profile";
import BoardOverView from "./pages/boardOverView/BoardOverView";
import BoardDetail from "./pages/boardDetail/BoardDetail";
import Login from "./pages/login/Login";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const router = createHashRouter([
  { path: "/login", element: <Login /> },
  {
    element: <ProtectedRoute />,
    errorElement: <Navigate to="/boards" replace />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/", element: <Navigate to="/boards" replace /> },
          { path: "/profile", element: <Profile /> },
          {
            path: "/boards",
            children: [
              { index: true, element: <BoardOverView /> },
              { path: ":id", element: <BoardDetail /> },
            ],
          },
          { path: "*", element: <Navigate to="/boards" replace /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
