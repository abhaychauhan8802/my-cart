import { Input, Button, Link } from "@nextui-org/react";
import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../store/useUserStore";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });

  const [isVisible, setIsVisible] = useState(false);

  const { login, loading, user } = useUserStore();

  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async (e) => {
    e.preventDefault();
    login(formFields);
    if (user && !loading) {
      navigate("/");
    }
  };

  return (
    <div className="w-full min-h-full flex mt-24 mb-10 items-center flex-col">
      <div className="max-w-2xl w-full px-10 md:px-14">
        <h1 className="text-3xl font-black mb-10">Login</h1>

        <form className="flex flex-col gap-8" onSubmit={handleLogin}>
          <div>
            <label className="block mb-2">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={formFields.email}
              onChange={(e) =>
                setFormFields({ ...formFields, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block mb-2">Password</label>
            <Input
              type={isVisible ? "text" : "password"}
              placeholder="Enter your password"
              value={formFields.password}
              onChange={(e) =>
                setFormFields({ ...formFields, password: e.target.value })
              }
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? <EyeOff /> : <Eye />}
                </button>
              }
            />
          </div>
          <Button
            className="py-3 font-bold text-md"
            type="submit"
            isDisabled={loading ? true : false}
            color="primary"
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>
        <div className="text-center mt-3">
          <span>
            Don't have an account?
            <Link href="/signup" className="pl-2 text-blue-700">
              Sign Up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
