import { useState } from "react";
import { Input, Button, Link } from "@nextui-org/react";
import { EyeOff, Eye } from "lucide-react";

import { toast } from "react-toastify";
import { useUserStore } from "../../../store/useUserStore";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isVisible, setIsVisible] = useState(false);

  const { signup, loading, user } = useUserStore();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSignUp = async (e) => {
    e.preventDefault();
    signup(formFields);
    if (user && !loading) {
      navigate("/");
    }
  };

  return (
    <div className="w-full min-h-full flex mt-24 mb-10 items-center flex-col">
      <div className="max-w-2xl w-full px-10 md:px-14">
        <h1 className="text-3xl font-black mb-10">SignUp</h1>

        <form className="flex flex-col gap-8" onSubmit={handleSignUp}>
          <div>
            <label className="block mb-2">Name</label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={formFields.name}
              onChange={(e) =>
                setFormFields({ ...formFields, name: e.target.value })
              }
            />
          </div>
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
          <div>
            <label className="block mb-2">Confirm Password</label>

            <Input
              type={isVisible ? "text" : "password"}
              placeholder="Confirm password"
              value={formFields.confirmPassword}
              onChange={(e) =>
                setFormFields({
                  ...formFields,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>
          <Button
            className="py-3 font-bold text-md"
            color="primary"
            type="submit"
            disabled={loading ? true : false}
          >
            {loading ? "Loading..." : "SignUp"}
          </Button>
        </form>
        <div className="text-center mt-3">
          <span>
            Don't have an account?
            <Link href="/login" className="pl-2 text-blue-700">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
