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
import { Group } from "../../api/type";
import { useGetRoles } from "../../hooks/useRoleQueries";
import { toast } from "react-toastify";

interface EditGroupProps {
  isOpen: boolean;
  onClose: () => void;
  groupToEdit: Group | null;
  onEdit: (updatedGroup: Group) => void;
}

const EditGroup = ({
  isOpen,
  onClose,
  groupToEdit,
  onEdit,
}: EditGroupProps) => {
  const [editedGroup, setEditedGroup] = useState<Group | null>(null);

  const {
    data: roles,
    isLoading: rolesLoading,
    error: rolesError,
  } = useGetRoles();

  useEffect(() => {
    if (groupToEdit) {
      setEditedGroup(groupToEdit);
    }
  }, [groupToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (editedGroup) {
      setEditedGroup((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  const handleEdit = () => {
    if (!editedGroup) return;

    if (!editedGroup.name.trim()) {
      toast.warning("Group name is required.");
      return;
    }

    if (!editedGroup.roleId) {
      toast.warning("A role must be selected.");
      return;
    }

    onEdit({
      ...editedGroup,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  if (!editedGroup) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
          <DialogDescription>
            Update the details of the group.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="name"
            value={editedGroup.name}
            onChange={handleChange}
            placeholder="Group Name"
          />
          {rolesLoading ? (
            <p>Loading roles...</p>
          ) : rolesError ? (
            <p className="text-red-500">Error loading roles</p>
          ) : roles && roles.length > 0 ? (
            <select
              name="roleId"
              value={editedGroup.roleId}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-600 text-sm"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          ) : (
            <p>No roles available</p>
          )}
          <Input
            name="description"
            value={editedGroup.description}
            onChange={handleChange}
            placeholder="Description (optional)"
          />
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

export default EditGroup;
