

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
import { Role } from "../../api/type";
import { useGetGroups } from "../../hooks/useGroupQueries";
import { useGetPermissions } from "../../hooks/usePermissionQueries";

interface CreateRoleProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (role: Role) => void;
}

const CreateRole = ({ isOpen, onClose, onCreate }: CreateRoleProps) => {
  const [newRole, setNewRole] = useState<Role>({
    id: "",
    name: "",
    groupId: "",
    permissionId: "", // Chuỗi rỗng
    description: "",
    createdAt: "",
    updatedAt: "",
  });

  const { data: groups, isLoading: groupsLoading, error: groupsError } = useGetGroups();
  const { data: permissions, isLoading: permissionsLoading, error: permissionsError } = useGetPermissions();

  // Parse permissionId từ chuỗi JSON thành mảng để kiểm tra checkbox
  const selectedPermissions = newRole.permissionId
    ? JSON.parse(newRole.permissionId)
    : [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewRole((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionChange = (permissionId: string) => {
    const currentPermissions = newRole.permissionId
      ? JSON.parse(newRole.permissionId)
      : [];
    let updatedPermissions: string[];

    if (currentPermissions.includes(permissionId)) {
      // Bỏ chọn
      updatedPermissions = currentPermissions.filter(
        (id: string) => id !== permissionId
      );
    } else {
      // Thêm chọn
      updatedPermissions = [...currentPermissions, permissionId];
    }

    setNewRole((prev) => ({
      ...prev,
      permissionId: JSON.stringify(updatedPermissions), // Map thành chuỗi JSON
    }));
  };

  const resetRole = () => {
    setNewRole({
      id: "",
      name: "",
      groupId: "",
      permissionId: "",
      description: "",
      createdAt: "",
      updatedAt: "",
    });
  };

  const handleCreate = () => {
    const { name, groupId, permissionId } = newRole;

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.warning("Name is required.");
      return;
    }
    // if (!groupId) {
    //   toast.warning("Group is required.");
    //   return;
    // }
    try {
      const parsedPermissions = JSON.parse(permissionId);
      if (!Array.isArray(parsedPermissions) || parsedPermissions.length === 0) {
        toast.warning("At least one permission is required.");
        return;
      }
    } catch {
      toast.warning("Invalid permission format.");
      return;
    }

    console.log("Permission ID string: ", permissionId);

    onCreate({
      ...newRole,
      name: trimmedName,
      groupId,
      permissionId, // Chuỗi JSON
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    resetRole();
    onClose();
  };

  const handleClose = () => {
    resetRole();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>
          <DialogDescription>Enter the details of the new role.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="name"
            value={newRole.name}
            onChange={handleChange}
            placeholder="Role Name"
          />

          {/* Group Selection */}
          {groupsLoading ? (
            <p>Loading groups...</p>
          ) : groupsError ? (
            <p className="text-red-500">Error loading groups</p>
          ) : (
            <select
              name="groupId"
              value={newRole.groupId}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-600 text-sm"
            >
              <option value="">Select Group</option>
              {groups?.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          )}

          {/* Permission Checkboxes */}
          {permissionsLoading ? (
            <p>Loading permissions...</p>
          ) : permissionsError ? (
            <p className="text-red-500">Error loading permissions</p>
          ) : (
            <div className="space-y-2 max-h-32 overflow-y-auto border p-2 rounded-md">
              <label className="block text-sm font-medium text-gray-700">
                Permissions
              </label>
              {permissions?.map((permission) => (
                <div key={permission.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`permission-${permission.id}`}
                    value={permission.id}
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={() => handlePermissionChange(permission.id)}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`permission-${permission.id}`}
                    className="text-sm text-gray-600"
                  >
                    {permission.name}
                  </label>
                </div>
              ))}
            </div>
          )}

          <Input
            name="description"
            value={newRole.description}
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

export default CreateRole;