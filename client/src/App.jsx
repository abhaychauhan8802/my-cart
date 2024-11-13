import { useEffect } from "react";
import { Routes, Route, useNavigate, useHref } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextUIProvider, Spinner } from "@nextui-org/react";
import { Admin, Login, PageNotFound, SignUp } from "./pages";
import { Header } from "./components";
import { useUserStore } from "./store/useUserStore";

const App = () => {
  const { user, isAuth, checkAuth } = useUserStore();

  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const AdimnRoutes = ({ children }) => {
    useEffect(() => {
      if (!user) {
        navigate("/login");
      } else if (!user.isAdmin) {
        navigate("/");
      }
    }, [navigate, user]);

    if (user && user.isAdmin) {
      return children;
    }

    return null;
  };

  const RedirectAuthenticatedUser = ({ children }) => {
    useEffect(() => {
      if (user) {
        navigate("/");
      }
    }, [navigate, user]);

    if (!user) {
      return children;
    }

    return null;
  };

  return (
    <NextUIProvider navigate={navigate} useHref={useHref}>
      <div className="w-screen h-screen overflow-hidden">
        <Header />
        <div className="w-full h-[calc(100%-4.5rem)] mt-[4.5rem] overflow-auto">
          {isAuth ? (
            <div className="w-full min-h-full flex justify-center items-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <Routes>
                <Route
                  path="/"
                  element={<h1 className="text-center">Home</h1>}
                />

                {/* Auth routes */}
                <Route
                  path="/login"
                  element={
                    <RedirectAuthenticatedUser>
                      <Login />
                    </RedirectAuthenticatedUser>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <RedirectAuthenticatedUser>
                      <SignUp />
                    </RedirectAuthenticatedUser>
                  }
                />

                {/* Admin */}
                <Route
                  path="/admin-dashboard"
                  element={
                    <AdimnRoutes>
                      <Admin />
                    </AdimnRoutes>
                  }
                />

                <Route path="*" element={<PageNotFound />} />
              </Routes>
              <ToastContainer position="top-center" hideProgressBar />
            </>
          )}
        </div>
      </div>
    </NextUIProvider>
  );
};

export default App;
