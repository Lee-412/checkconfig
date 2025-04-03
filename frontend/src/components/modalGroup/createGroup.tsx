

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
import { Group } from "../../api/type";
import { useGetRoles } from "../../hooks/useRoleQueries";

interface CreateGroupProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (group: Group) => void;
}

const CreateGroup = ({ isOpen, onClose, onCreate }: CreateGroupProps) => {
  const [newGroup, setNewGroup] = useState<Group>({
    id: "",
    name: "",
    roleId: "",
    description: "",
    createdAt: "",
    updatedAt: "",
  });

  const { data: roles, isLoading: rolesLoading, error: rolesError } = useGetRoles();

  const selectedRoles = newGroup.roleId ? JSON.parse(newGroup.roleId) : [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewGroup((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (roleId: string) => {
    const currentRoles = newGroup.roleId ? JSON.parse(newGroup.roleId) : [];
    let updatedRoles: string[];

    if (currentRoles.includes(roleId)) {
      updatedRoles = currentRoles.filter((id: string) => id !== roleId);
    } else {
      updatedRoles = [...currentRoles, roleId];
    }

    setNewGroup((prev) => ({
      ...prev,
      roleId: JSON.stringify(updatedRoles),
    }));
  };

  const resetGroup = () => {
    setNewGroup({
      id: "",
      name: "",
      roleId: "",
      description: "",
      createdAt: "",
      updatedAt: "",
    });
  };

  const handleCreate = () => {
    const { name, roleId } = newGroup;

    if (!name.trim()) {
      toast.warning("Group name is required.");
      return;
    }
    try {
      const parsedRoles = JSON.parse(roleId);
      if (!Array.isArray(parsedRoles) || parsedRoles.length === 0) {
        toast.warning("At least one role must be selected.");
        return;
      }
    } catch {
      toast.warning("Invalid role ID format.");
      return;
    }

    const formattedGroup = {
      ...newGroup,
      name: name.trim(),
      roleId,
    };

    onCreate(formattedGroup);
    resetGroup();
    onClose();
  };

  const handleClose = () => {
    resetGroup();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>Enter the details of the new group.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="name"
            value={newGroup.name}
            onChange={handleChange}
            placeholder="Group Name"
          />
          {rolesLoading ? (
            <p>Loading roles...</p>
          ) : rolesError ? (
            <p className="text-red-500">Error loading roles</p>
          ) : roles && roles.length > 0 ? (
            <div className="space-y-2 max-h-32 overflow-y-auto border p-2 rounded-md">
              <label className="block text-sm font-medium text-gray-700">
                Roles
              </label>
              {roles.map((role) => (
                <div key={role.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`role-${role.id}`}
                    value={role.id}
                    checked={selectedRoles.includes(role.id)}
                    onChange={() => handleRoleChange(role.id)}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`role-${role.id}`}
                    className="text-sm text-gray-600"
                  >
                    {role.name}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p>No roles available</p>
          )}
          <Input
            name="description"
            value={newGroup.description}
            onChange={handleChange}
            placeholder="Description (optional)"
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

export default CreateGroup;