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
import { Route } from "../../api/type";
import { useState } from "react";

interface CreateRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (route: Route) => void;
}

const CreateRouteModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateRouteModalProps) => {
  const [newRoute, setNewRoute] = useState<Route>({
    id: "",
    name: "",
    route: "",
    method: "GET",
    checkProtected: false,
    descripString: "",
    createdAt: "",
    updatedAt: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewRoute((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProtectedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoute((prev) => ({
      ...prev,
      checkProtected: e.target.checked,
    }));
  };

  const resetRoute = () => {
    setNewRoute({
      id: "",
      name: "",
      route: "",
      method: "GET",
      checkProtected: false,
      descripString: "",
      createdAt: "",
      updatedAt: "",
    });
  };

  const handleCreate = () => {
    const { name, route, method } = newRoute;

    const trimmedName = name.trim();
    const trimmedRoute = route.trim();

    if (!trimmedName || !trimmedRoute || !method) {
      toast.warning("Name, Route, and Method are required.");
      return;
    }
const routeRegex = /^\/.+/;
  if (!routeRegex.test(trimmedRoute)) {
    toast.warning("Route must start with '/' and have at least one character (e.g., '/home').");
    return;
  }
    onCreate({
      ...newRoute,
      name: trimmedName,
      route: trimmedRoute,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    resetRoute();
    onClose();
  };

  const handleClose = () => {
    resetRoute();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Route</DialogTitle>
          <DialogDescription>Enter route details.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="name"
            value={newRoute.name}
            onChange={handleChange}
            placeholder="Route Name"
          />
          <Input
            name="route"
            value={newRoute.route}
            onChange={handleChange}
            placeholder="Route Path (e.g., /api/users)"
          />
          <select
            name="method"
            value={newRoute.method}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-600 text-sm"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="checkProtected"
              checked={newRoute.checkProtected}
              onChange={handleProtectedChange}
            />
            <label htmlFor="checkProtected">Protected</label>
          </div>
          <Input
            name="descripString"
            value={newRoute.descripString}
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

export default CreateRouteModal;
