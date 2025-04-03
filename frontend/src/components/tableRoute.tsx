import {
  Search,
  Plus,
  Trash,
  Trash2,
  RefreshCw,
  Save,
  ArrowUpDown,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import ImportRoute from "./modalRoute/importCsv";
import { useState, useEffect } from "react";
import {
  useCreateRoute,
  useEditRoute,
  useDeleteRoute,
  useDeleteMultipleRoute,
} from "../hooks/useRouteQueries";
import { toast } from "react-toastify";
import { Route } from "../api/type";
import DeleteConfirm from "./confirmBox";
import DeleteMultipleConfirm from "./confirmMultipleBox";
import DuplicateRoute from "./modalRoute/duplicateRoute";
import CreateRouteModal from "./modalRoute/createRoute";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { copyToClipboard, formatId } from "../utils/handleId";

interface TableRouteProps {
  routes: Route[];
}

// const formatId = (id: string) => {
//   if (!id || id.length < 4) return id; // Check an toàn
//   return `${id.slice(0, 2)}...${id.slice(-2)}`;
// };

//   const copyToClipboard = (id: string) => {
//     navigator.clipboard.writeText(id);
//     toast.success("Copied ID to clipboard!");
//   };

type SortKey = keyof Route;
type SortOrder = "asc" | "desc";

const TableRoute = ({ routes }: TableRouteProps) => {
  const [routeList, setRouteList] = useState<Route[]>(routes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [duplicateRoutes, setDuplicateRoutes] = useState<Route[]>([]);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editedRoutes, setEditedRoutes] = useState<Route[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isOpenConfirmMultiple, setIsOpenConfirmMultiple] = useState(false);
  const [idDelete, setIdDelete] = useState<string>("");
  const [isCreateRouteOpen, setIsCreateRouteOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const itemsPerPage = 5;

  useEffect(() => {
    setRouteList(routes);
  }, [routes]);

  const filteredRoutes = routeList.filter(
    (route) =>
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedRoutes = [...filteredRoutes].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (sortKey === "createdAt") {
      const aDate = new Date(aValue as string | Date);
      const bDate = new Date(bValue as string | Date);
      return sortOrder === "asc"
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    }

    if (sortKey === "checkProtected") {
      const aBool = aValue as boolean;
      const bBool = bValue as boolean;
      return sortOrder === "asc"
        ? aBool === bBool
          ? 0
          : aBool
          ? -1
          : 1
        : bBool === aBool
        ? 0
        : bBool
        ? -1
        : 1;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // Fallback for numeric comparison (e.g., id if it's a number)
    return sortOrder === "asc"
      ? aValue > bValue
        ? 1
        : -1
      : bValue > aValue
      ? 1
      : -1;
  });

  const totalPages = Math.max(1, Math.ceil(sortedRoutes.length / itemsPerPage));
  const currentRoutes = sortedRoutes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [sortedRoutes, totalPages, currentPage]);

  const createRouteMutation = useCreateRoute();
  const editRouteMutation = useEditRoute();
  const deleteRouteMutation = useDeleteRoute();
  const deleteMultipleRouteMutation = useDeleteMultipleRoute();

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedRoutes((prev) =>
      prev.includes(id)
        ? prev.filter((routeId) => routeId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRoutes(e.target.checked ? currentRoutes.map((t) => t.id) : []);
  };

  const handleSubmitChanges = () => {
    if (editedRoutes.length === 0) {
      toast.info("No changes to update.");
      return;
    }

    Promise.all(
      editedRoutes.map((route) =>
        editRouteMutation.mutateAsync(route, {
          onSuccess: () => {
            toast.success(`Route ${route.name} updated successfully`);
            setRouteList((prev) =>
              prev.map((r) => (r.id === route.id ? route : r))
            );
          },
          onError: () => {
            toast.error(`Failed to update route ${route.name}`);
          },
        })
      )
    ).then(() => {
      setEditedRoutes([]);
    });
  };

  const handleReplaceRoutes = (duplicates: Route[]) => {
    Promise.all(
      duplicates.map((route) =>
        editRouteMutation.mutateAsync(route, {
          onSuccess: () => {
            toast.success(
              `Duplicate route ${route.name} replaced successfully`
            );
            setRouteList((prev) =>
              prev.map((r) => (r.id === route.id ? route : r))
            );
          },
          onError: () => {
            toast.error(`Failed to replace duplicate route ${route.name}`);
          },
        })
      )
    ).then(() => {
      setDuplicateRoutes([]);
      setIsDuplicateModalOpen(false);
    });
  };

  const onImport = async (newRoutes: Route[]) => {
    const existingNames = new Set(routeList.map((route) => route.name));
    const duplicates = newRoutes.filter((route) =>
      existingNames.has(route.name)
    );
    const uniqueRoutes = newRoutes.filter(
      (route) => !existingNames.has(route.name)
    );

    if (duplicates.length > 0) {
      setDuplicateRoutes(duplicates);
      setIsDuplicateModalOpen(true);
    }

    if (uniqueRoutes.length > 0) {
      Promise.all(
        uniqueRoutes.map((route) =>
          createRouteMutation.mutateAsync(route, {
            onSuccess: () => {
              toast.success(`Route ${route.name} imported successfully`);
              setRouteList((prev) => [...prev, route]);
            },
            onError: () => {
              toast.error(`Failed to import route ${route.name}`);
            },
          })
        )
      );
    }
  };

  const handleCreateRoute = () => {
    setIsOpen(true);
  };

  const handleClickDeleteRoute = (id: string) => {
    setIdDelete(id);
    setIsOpenConfirm(true);
  };

  const handleToggleProtected = (id: string, currentStatus: boolean) => {
    const updatedRoutes = routeList.map((route) =>
      route.id === id ? { ...route, checkProtected: !currentStatus } : route
    );
    setRouteList(updatedRoutes);

    const editedRoute = updatedRoutes.find((route) => route.id === id);
    if (editedRoute) {
      setEditedRoutes((prev) => {
        const exists = prev.some((r) => r.id === editedRoute.id);
        return exists
          ? prev.map((r) => (r.id === editedRoute.id ? editedRoute : r))
          : [...prev, editedRoute];
      });
    }
  };

  const handleSelectAllProtected = () => {
    const allSelected = currentRoutes.every((route) => route.checkProtected);
    const updatedRoutes = routeList.map((route) =>
      currentRoutes.some((r) => r.id === route.id)
        ? { ...route, checkProtected: !allSelected }
        : route
    );
    setRouteList(updatedRoutes);

    const editedCurrentRoutes = updatedRoutes.filter((route) =>
      currentRoutes.some((r) => r.id === route.id)
    );
    setEditedRoutes((prev) => {
      const updated = new Map(prev.map((r) => [r.id, r]));
      editedCurrentRoutes.forEach((route) => updated.set(route.id, route));
      return Array.from(updated.values());
    });
  };

  const handleDeleteRoute = async (id: string) => {
    deleteRouteMutation.mutate(id, {
      onSuccess: () => {
        setRouteList((prev) => prev.filter((route) => route.id !== id));
        setSelectedRoutes((prev) => prev.filter((routeId) => routeId !== id));
        toast.success("Route deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete route");
      },
    });
  };

  const handleDeleteSelectedRoutes = () => {
    if (selectedRoutes.length === 0) {
      toast.warn("No routes selected");
      return;
    }
    deleteMultipleRouteMutation.mutate(selectedRoutes, {
      onSuccess: () => {
        setRouteList((prev) =>
          prev.filter((route) => !selectedRoutes.includes(route.id))
        );
        setSelectedRoutes([]);
        toast.success("Routes deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete selected routes");
      },
    });
  };

  const handleCreateRouteSubmit = (newRoute: Route) => {
    console.log("Fucking create new Route", newRoute);

    createRouteMutation.mutate(newRoute, {
      onSuccess: () => {
        toast.success(`Route ${newRoute.name} created successfully`);
        setRouteList((prev) => [...prev, newRoute]);
      },
      onError: () => {
        toast.error(`Failed to create route ${newRoute.name}`);
      },
    });
  };

  return (
    <div className="w-full bg-white dark:bg-background border p-5 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
        <div className="relative w-full sm:w-1/3">
          <Input
            placeholder="Search by name, route, or method..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setIsCreateRouteOpen(true)}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" /> Create
          </Button>
          <Button
            onClick={handleCreateRoute}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" /> Import
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button
            onClick={() => setIsOpenConfirmMultiple(true)}
            className="bg-red-500 text-white hover:bg-red-600"
            disabled={selectedRoutes.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
          <Button
            onClick={handleSubmitChanges}
            className="bg-green-500 text-white hover:bg-green-600"
            disabled={editedRoutes.length === 0}
          >
            <Save className="w-4 h-4 mr-2" /> Submit Changes
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  currentRoutes.length > 0 &&
                  currentRoutes.every((route) =>
                    selectedRoutes.includes(route.id)
                  )
                }
              />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("id")}
            >
              ID <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Name <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("route")}
            >
              Route <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("method")}
            >
              Method <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("createdAt")}
            >
              Created <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead>
            <TableHead
              className="w-32 cursor-pointer"
              onClick={() => handleSort("checkProtected")}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={handleSelectAllProtected}
                  checked={
                    currentRoutes.length > 0 &&
                    currentRoutes.every((route) => route.checkProtected)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
                <span>
                  Protected <ArrowUpDown className="inline w-4 h-4 ml-1" />
                </span>
              </div>
            </TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRoutes.length > 0 ? (
            currentRoutes.map((route) => (
              <TableRow key={route.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(route.id)}
                    checked={selectedRoutes.includes(route.id)}
                  />
                </TableCell>

                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="cursor-pointer hover:underline"
                          onClick={() => copyToClipboard(route.id)}
                        >
                          {formatId(route.id)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{route.id}</p>
                        <p>Click to copy</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>

                <TableCell>{route.name}</TableCell>
                <TableCell>{route.route}</TableCell>
                <TableCell>{route.method}</TableCell>
                <TableCell>
                  {new Date(route.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={route.checkProtected}
                    onChange={() =>
                      handleToggleProtected(route.id, route.checkProtected)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleClickDeleteRoute(route.id)}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No routes found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4 text-gray-500">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || sortedRoutes.length === 0}
        >
          Next
        </Button>
      </div>

      <ImportRoute
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onImport={onImport}
      />
      <CreateRouteModal
        isOpen={isCreateRouteOpen}
        onClose={() => setIsCreateRouteOpen(false)}
        onCreate={handleCreateRouteSubmit}
      />
      <DeleteConfirm
        isOpen={isOpenConfirm}
        onClose={() => setIsOpenConfirm(false)}
        onConfirm={handleDeleteRoute}
        providerId={idDelete}
        type="Route"
      />
      <DeleteMultipleConfirm
        isOpen={isOpenConfirmMultiple}
        onClose={() => setIsOpenConfirmMultiple(false)}
        onConfirm={handleDeleteSelectedRoutes}
        selectedArray={selectedRoutes}
        type="Route"
      />
      <DuplicateRoute
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        duplicates={duplicateRoutes}
        onReplace={handleReplaceRoutes}
      />
    </div>
  );
};

export default TableRoute;
