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
import { Permission, Route } from "../../api/type";
import { useGetRoutes } from "../../hooks/useRouteQueries";
import { toast } from "react-toastify";

interface EditPermissionProps {
  isOpen: boolean;
  onClose: () => void;
  permissionToEdit: Permission | null;
  onEdit: (updatedPermission: Permission) => void;
}

const EditPermission = ({
  isOpen,
  onClose,
  permissionToEdit,
  onEdit,
}: EditPermissionProps) => {
  const [editedPermission, setEditedPermission] = useState<Permission | null>(
    null
  );
  const [selectedRoutes, setSelectedRoutes] = useState<Route[]>([]);

  const {
    data: routes,
    isLoading: routesLoading,
    error: routesError,
  } = useGetRoutes();

  useEffect(() => {
    if (permissionToEdit) {
      setEditedPermission(permissionToEdit);
      // Parse apiRoutes to pre-select routes
      const parsedRoutes = JSON.parse(permissionToEdit.apiRoutes || "[]");
      const preSelected = (routes || []).filter((route: Route) =>
        parsedRoutes.some(
          (r: { path: string; method: string }) =>
            r.path === route.route && r.method === route.method
        )
      );
      setSelectedRoutes(preSelected);
    }
  }, [permissionToEdit, routes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedPermission) {
      setEditedPermission((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  const handleRouteToggle = (route: Route) => {
    setSelectedRoutes((prev) =>
      prev.some((r) => r.id === route.id)
        ? prev.filter((r) => r.id !== route.id)
        : [...prev, route]
    );
  };

  const handleEdit = () => {
    if (!editedPermission) return;

    if (!editedPermission.name.trim()) {
      toast.warning("Permission name is required.");
      return;
    }

    if (selectedRoutes.length === 0) {
      toast.warning("At least one API route must be selected.");
      return;
    }

    const formattedApiRoutes = JSON.stringify(
      selectedRoutes.map((route) => ({
        path: route.route,
        method: route.method,
      }))
    );

    onEdit({
      ...editedPermission,
      apiRoutes: formattedApiRoutes,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  if (!editedPermission) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Permission</DialogTitle>
          <DialogDescription>
            Update the details of the permission.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="name"
            value={editedPermission.name}
            onChange={handleChange}
            placeholder="Permission Name"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Routes
            </label>
            {routesLoading ? (
              <p>Loading routes...</p>
            ) : routesError ? (
              <p className="text-red-500">Error loading routes</p>
            ) : routes && routes.length > 0 ? (
              <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                {routes.map((route: Route) => (
                  <div key={route.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedRoutes.some((r) => r.id === route.id)}
                      onChange={() => handleRouteToggle(route)}
                    />
                    <span>{`${route.route} (${route.method})`}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No routes available</p>
            )}
          </div>
          <Input
            name="description"
            value={editedPermission.description}
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

export default EditPermission;
