import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Profile from "./pages/profile/Profile";
import BoardOverView from "./pages/boardOverView/BoardOverView";
import BoardDetail from "./pages/boardDetail/BoardDetail";
import Layout from "./components/layout/Layout";
import UserNameProvider from "./context/UserNameProvider";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
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
      ],
    },
  ]);

  return (
    <UserNameProvider>
      <RouterProvider router={router}></RouterProvider>;
    </UserNameProvider>
  );
}

export default App;
