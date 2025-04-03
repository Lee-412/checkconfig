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
import { Role } from "../../api/type";
import { useGetGroups } from "../../hooks/useGroupQueries";
import { useGetPermissions } from "../../hooks/usePermissionQueries";
import { toast } from "react-toastify";

interface EditRoleProps {
  isOpen: boolean;
  onClose: () => void;
  roleToEdit: Role | null;
  onEdit: (updatedRole: Role) => void;
}

const EditRole = ({ isOpen, onClose, roleToEdit, onEdit }: EditRoleProps) => {
  const [editedRole, setEditedRole] = useState<Role | null>(null);

  const {
    data: groups,
    isLoading: groupsLoading,
    error: groupsError,
  } = useGetGroups();
  const {
    data: permissions,
    isLoading: permissionsLoading,
    error: permissionsError,
  } = useGetPermissions();

  useEffect(() => {
    if (roleToEdit) {
      setEditedRole(roleToEdit);
    }
  }, [roleToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (editedRole) {
      setEditedRole((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  const handleEdit = () => {
    if (!editedRole) return;

    if (!editedRole.name.trim()) {
      toast.warning("Role name is required.");
      return;
    }

    // if (!editedRole.groupId) {
    //   toast.warning("A group must be selected.");
    //   return;
    // }

    if (!editedRole.permissionId) {
      toast.warning("A permission must be selected.");
      return;
    }

    onEdit({
      ...editedRole,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  if (!editedRole) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>Update the details of the role.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="name"
            value={editedRole.name}
            onChange={handleChange}
            placeholder="Role Name"
          />
          {groupsLoading ? (
            <p>Loading groups...</p>
          ) : groupsError ? (
            <p className="text-red-500">Error loading groups</p>
          ) : groups && groups.length > 0 ? (
            <select
              name="groupId"
              value={editedRole.groupId}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-600 text-sm"
            >
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          ) : (
            <p>No groups available</p>
          )}
          {permissionsLoading ? (
            <p>Loading permissions...</p>
          ) : permissionsError ? (
            <p className="text-red-500">Error loading permissions</p>
          ) : permissions && permissions.length > 0 ? (
            <select
              name="permissionId"
              value={editedRole.permissionId}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-600 text-sm"
            >
              <option value="">Select Permission</option>
              {permissions.map((permission) => (
                <option key={permission.id} value={permission.id}>
                  {permission.name}
                </option>
              ))}
            </select>
          ) : (
            <p>No permissions available</p>
          )}
          <Input
            name="description"
            value={editedRole.description}
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

export default EditRole;
