import { useState, useEffect } from "react";
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
import { Checkbox } from "../ui/checkbox";
import { User } from "../../api/type";

interface EditUserProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit: User | null;
  onEdit: (updatedUser: User) => void;
}

const EditUser = ({ isOpen, onClose, userToEdit, onEdit }: EditUserProps) => {
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [changePassword, setChangePassword] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setEditedUser(userToEdit);
    }
  }, [userToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedUser) {
      setEditedUser((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  const handleEdit = () => {
    if (editedUser) {
      onEdit(editedUser);
      onClose();
    }
  };

  if (!editedUser) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update the details of the user.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="username"
            name="username"
            value={editedUser.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={changePassword}
              onChange={(e) => setChangePassword(e.target.checked)}
            />
            <label>Change Password</label>
          </div>
          {changePassword && (
            <>
              <Input
                type="password"
                name="oldPassword"
                onChange={handleChange}
                placeholder="Old Password"
              />
              <Input
                type="password"
                name="newPassword"
                onChange={handleChange}
                placeholder="New Password"
              />
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleEdit}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUser;
