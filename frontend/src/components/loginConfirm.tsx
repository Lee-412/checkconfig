// components/LoginConfirm.tsx
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { LucideMessageCircleWarning } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoginConfirmProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginConfirm = ({ isOpen, onClose }: LoginConfirmProps) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/signin");
    onClose();
  };

  const handleCancel = () => {
    navigate("/"); // Redirect to dashboard
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:w-[400px] max-w-sm p-6 bg-white rounded-xl shadow-xl transform transition-all duration-500 ease-out scale-105">
        <DialogHeader className="flex items-center space-x-3 mb-4">
          <div className="flex flex-col">
            <div className="flex gap-3 items-center">
              <DialogTitle className="text-2xl font-semibold text-gray-800">
                Login Required
              </DialogTitle>
              <LucideMessageCircleWarning className="w-12 h-12 text-red-600 animate-pulse" />
            </div>
            <DialogDescription className="text-gray-600 mt-2">
              You need to log in to access this page. Would you like to proceed
              to the login page?
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="flex justify-between gap-4 mt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 focus:ring-2 focus:ring-gray-400 transition-all duration-200 ease-in-out"
          >
            Cancel
          </Button>
          <Button
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 transform active:scale-95"
            onClick={handleConfirm}
          >
            Yes, Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginConfirm;
