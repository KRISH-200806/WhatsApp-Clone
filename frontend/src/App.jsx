import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./redux/auth/authSlice";
 // Import checkAuth action

const App = () => {
  const dispatch = useDispatch();
  const { authUser, isCheckingAuth, onlineUsers } = useSelector(
    (state) => state.auth
  ); // Get auth state

  console.log({ onlineUsers });

  useEffect(() => {
    dispatch(checkAuth()); // Dispatch checkAuth on mount
  }, [dispatch]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
