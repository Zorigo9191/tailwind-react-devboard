import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import "./index.css";
import Profile from "./pages/profile/Profile";
import BoardOverView from "./pages/boardOverView/BoardOverView";
import BoardDetail from "./pages/boardDetail/BoardDetail";
import Layout from "./components/layout/Layout";
import UserNameProvider from "./context/UserNameProvider";

function App() {

  const router = createHashRouter([
    {
      element: <Layout />,
      errorElement: <Navigate to="/boards" replace />,
      children: [
        { path: "/", element: <Navigate to="/boards" replace /> },
        {
          path: "/profile",
          element: <Profile />,
        },
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
  ]);

  return (
    <UserNameProvider>
      <RouterProvider router={router} />
    </UserNameProvider>
  );
}

export default App;
