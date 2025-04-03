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
import { Permission, Route } from "../../api/type";

// Assuming this hook exists to fetch routes
import { useGetRoutes } from "../../hooks/useRouteQueries";

interface CreatePermissionProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (permission: Permission) => void;
}

const CreatePermission = ({
  isOpen,
  onClose,
  onCreate,
}: CreatePermissionProps) => {
  const [newPermission, setNewPermission] = useState<Permission>({
    id: "",
    name: "",
    apiRoutes: "",
    description: "",
    createdAt: "",
    updatedAt: "",
  });
  const [selectedRoutes, setSelectedRoutes] = useState<Route[]>([]);

  // Fetch routes
  const {
    data: routes,
    isLoading: routesLoading,
    error: routesError,
  } = useGetRoutes();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPermission((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRouteToggle = (route: Route) => {
    setSelectedRoutes((prev) =>
      prev.some((r) => r.id === route.id)
        ? prev.filter((r) => r.id !== route.id)
        : [...prev, route]
    );
  };

  const resetPermission = () => {
    setNewPermission({
      id: "",
      name: "",
      apiRoutes: "",
      description: "",
      createdAt: "",
      updatedAt: "",
    });
    setSelectedRoutes([]);
  };

  const handleCreate = () => {
    const { name } = newPermission;

    if (!name.trim()) {
      toast.warning("Permission name is required.");
      return;
    }

    if (selectedRoutes.length === 0) {
      toast.warning("At least one API route must be selected.");
      return;
    }

    // Format apiRoutes as [{"path": "...", "method": "..."}]
    const formattedApiRoutes = JSON.stringify(
      selectedRoutes.map((route) => ({
        path: route.route,
        method: route.method,
      }))
    );

    onCreate({
      ...newPermission,
      name: name.trim(),
      apiRoutes: formattedApiRoutes,
    });
    resetPermission();
    onClose();
  };

  const handleClose = () => {
    resetPermission();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Permission</DialogTitle>
          <DialogDescription>
            Enter the details of the new permission and select API routes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="name"
            value={newPermission.name}
            onChange={handleChange}
            placeholder="Permission Name"
          />

          {/* Route Selection */}
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
            value={newPermission.description}
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

export default CreatePermission;
