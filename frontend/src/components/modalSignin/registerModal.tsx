import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons from lucide-react

interface RegisterModalProps {
  onRegister: (registerData: { username: string; password: string }) => void;
  onClose: () => void;
  loading: boolean;
}

const RegisterModal = ({
  onRegister,
  onClose,
  loading,
}: RegisterModalProps) => {
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const validateUsername = (username: string): string | null => {
    if (!username) return "Username is required.";
    if (/\s/.test(username)) return "Username cannot contain spaces.";
    return null;
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = () => {
    const { username, password } = registerData;

    if (!username || !password) {
      toast.warning("All fields are required.");
      return;
    }

    const usernameError = validateUsername(username);
    if (usernameError) {
      toast.warning(usernameError);
      return;
    }

    if (!validatePassword(password)) {
      toast.warning(
        "Password must have at least 8 characters, including uppercase, lowercase, number, and special character."
      );
      return;
    }

    onRegister(registerData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="username"
            value={registerData.username}
            onChange={handleChange}
            placeholder="Email"
            disabled={loading}
          />
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"} // Toggle type based on showPassword state
              value={registerData.password}
              onChange={handleChange}
              placeholder="Password"
              disabled={loading}
              className="pr-10" // Add padding-right to make space for the icon
            />
            <button
              // variant="ghost"
              type="button"
              className="absolute right-2 top-2 text-gray-500 p-0"
              onClick={togglePasswordVisibility}
              disabled={loading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleRegister}
            disabled={loading}
          >
            Register
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
