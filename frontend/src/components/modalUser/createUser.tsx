import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { toast } from "react-toastify";
import { User } from "../../api/type";

interface CreateUserProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (user: User) => void;
}

const CreateUser = ({ isOpen, onClose, onCreate }: CreateUserProps) => {
  const [newUser, setNewUser] = useState({
    id: "",
    username: "",
    password: "",
    createdAt: "",
    updatedAt: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = () => {
    const { username, password } = newUser;

    if (!username.trim() || !password.trim()) {
      toast.warning("All fields are required.");
      return;
    }

    if (password.length < 8) {
      toast.warning("Password must be at least 8 characters long.");
      return;
    }

    onCreate(newUser);
    setNewUser({
      id: "",
      username: "",
      password: "",
      createdAt: "",
      updatedAt: "",
    });
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Enter the details of the new user.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="username"
            name="username"
            value={newUser.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <Input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleChange}
            placeholder="Password"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleCreate}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUser;
