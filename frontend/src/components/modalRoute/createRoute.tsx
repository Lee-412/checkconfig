import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
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

  const [newGetRoute, setNewGetRoute] = useState<Route>({
    id: "",
    name: "",
    route: "",
    method: "GET",
    checkProtected: false,
    descripString: "",
    createdAt: "",
    updatedAt: "",
  });

  const [newPostRoute, setNewPostRoute] = useState<Route>({
    id: "",
    name: "",
    route: "",
    method: "POST",
    checkProtected: false,
    descripString: "",
    createdAt: "",
    updatedAt: "",
  });

  const [newPutRoute, setNewPutRoute] = useState<Route>({
    id: "",
    name: "",
    route: "",
    method: "PUT",
    checkProtected: false,
    descripString: "",
    createdAt: "",
    updatedAt: "",
  });

  const [newDeleteRoute, setNewDeleteRoute] = useState<Route>({
    id: "",
    name: "",
    route: "",
    method: "Delete",
    checkProtected: false,
    descripString: "",
    createdAt: "",
    updatedAt: "",
  });

  const [getChecked, setGetChecked] = useState<boolean>(false)
  const [postChecked, setPostChecked] = useState<boolean>(false)
  const [putChecked, setPutChecked] = useState<boolean>(false)
  const [deleteChecked, setDeleteChecked] = useState<boolean>(false)

  // const [getProtect, setGetProtect] = useState<boolean>(false)
  // const [postProtect, setPostProtect] = useState<boolean>(false)
  // const [putProctect, setPutProtect] = useState<boolean>(false)
  // const [deleteProtect, setDeleteProtect] = useState<boolean>(false)


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewRoute((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleProtectedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setNewRoute((prev) => ({
  //     ...prev,
  //     checkProtected: e.target.checked,
  //   }));
  // };

  const handleGetProtectedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGetRoute((prev) => ({
      ...prev,
      checkProtected: e.target.checked,
    }));
  };

  const handlePostProtectedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPostRoute((prev) => ({
      ...prev,
      checkProtected: e.target.checked,
    }));
  };

  const handlePutProtectedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPutRoute((prev) => ({
      ...prev,
      checkProtected: e.target.checked,
    }));
  };

  const handleDeleteProtectedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDeleteRoute((prev) => ({
      ...prev,
      checkProtected: e.target.checked,
    }));
  };
  const handleGetChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGetChecked(!getChecked)
  };

  const handlePostChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostChecked(!postChecked)
  };

  const handlePutChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPutChecked(!putChecked)
  };

  const handleDeleteChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeleteChecked(!deleteChecked)
  };

  const resetRoute = (method: string) => {
    if (method === "GET") {
      setNewGetRoute({
        id: "",
        name: "",
        route: "",
        method: "GET",
        checkProtected: false,
        descripString: "",
        createdAt: "",
        updatedAt: "",
      })
    }
    else if (method === "POST") {
      setNewPostRoute({
        id: "",
        name: "",
        route: "",
        method: "Post",
        checkProtected: false,
        descripString: "",
        createdAt: "",
        updatedAt: "",
      })
    }
    else if (method === "PUT") {
      setNewPutRoute({
        id: "",
        name: "",
        route: "",
        method: "Put",
        checkProtected: false,
        descripString: "",
        createdAt: "",
        updatedAt: "",
      })
    }

    else if (method === "DELETE") {
      setNewDeleteRoute({
        id: "",
        name: "",
        route: "",
        method: "Delete",
        checkProtected: false,
        descripString: "",
        createdAt: "",
        updatedAt: "",
      })
    } else {
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
    }

  };

  const handleCreate = () => {
    const { name, route, descripString } = newRoute;
    let methods = []
    if (getChecked) methods.push("GET")
    if (postChecked) methods.push("POST")
    if (putChecked) methods.push("PUT")
    if (deleteChecked) methods.push("DELETE")

    const trimmedName = name.trim();
    const trimmedRoute = route.trim();

    if (!trimmedName || !trimmedRoute || methods.length == 0) {
      toast.warning("Name, Route, and Method are required.");
      return;
    }
    const routeRegex = /^\/.+/;
    if (!routeRegex.test(trimmedRoute)) {
      toast.warning("Route must start with '/' and have at least one character (e.g., '/home').");
      return;
    }

    for (let i = 0; i < methods.length; i++) {
      const method = methods[i]
      console.log(method);

      switch (method) {
        case "GET":
          onCreate({
            ...newGetRoute,
            name: trimmedName,
            route: trimmedRoute,
            method: "GET",
            descripString: descripString,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          resetRoute('GET')
          break;
        case "POST":
          onCreate({
            ...newGetRoute,
            name: trimmedName,
            route: trimmedRoute,
            method: "POST",
            descripString: descripString,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          resetRoute('POST')
          break;
        case "PUT":
          onCreate({
            ...newGetRoute,
            name: trimmedName,
            route: trimmedRoute,
            method: "PUT",
            descripString: descripString,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          resetRoute('PUT')
          break;
        case "DELETE":
          onCreate({
            ...newGetRoute,
            name: trimmedName,
            route: trimmedRoute,
            method: "DELETE",
            descripString: descripString,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          resetRoute('DELETE')
          break;
      }
    }

    resetRoute("DEFAULT");
    onClose();
  };

  const handleClose = () => {
    resetRoute("DEFAULT");
    resetRoute('GET')
    resetRoute('POST')
    resetRoute('PUT')
    resetRoute('DELETE')

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
          {/* GET */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="GET"
              checked={getChecked}
              onChange={handleGetChecked}
            />
            <label htmlFor="checkProtected">GET</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="checkGetProtected"
              checked={newGetRoute.checkProtected}
              onChange={handleGetProtectedChange}
            />
            <label htmlFor="checkProtected">Protected</label>
          </div>

          <Separator className="my-4" />

          {/* POST */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="POST"
              checked={postChecked}
              onChange={handlePostChecked}
            />
            <label htmlFor="checkProtected">POST</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="checkPostProtected"
              checked={newPostRoute.checkProtected}
              onChange={handlePostProtectedChange}
            />
            <label htmlFor="checkProtected">Protected</label>
          </div>

          <Separator className="my-4" />


          {/* PUT */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="PUT"
              checked={putChecked}
              onChange={handlePutChecked}
            />
            <label htmlFor="checkPutProtected">PUT</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="checkProtected"
              checked={newPutRoute.checkProtected}
              onChange={handlePutProtectedChange}
            />
            <label htmlFor="checkProtected">Protected</label>
          </div>

          <Separator className="my-4" />

          {/* DELETE */}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="DELETE"
              checked={deleteChecked}
              onChange={handleDeleteChecked}
            />
            <label htmlFor="checkDeleteProtected">DELETE</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="checkProtected"
              checked={newDeleteRoute.checkProtected}
              onChange={handleDeleteProtectedChange}
            />
            <label htmlFor="checkProtected">Protected</label>
          </div>

          <Separator className="my-4" />
          {/* protected check */}

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
