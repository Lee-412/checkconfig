import { useState } from "react";
import {
  Search,
  Plus,
  RefreshCw,
  Trash2,
  Edit,
  Trash,
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
import CreatePermission from "./modalPermission/createPermission";
import EditPermission from "./modalPermission/editPermission";
import DeleteConfirm from "./confirmBox";
import DeleteMultipleConfirm from "./confirmMultipleBox";
import { toast } from "react-toastify";
import {
  useCreatePermissions,
  useDeletePermissions,
  useEditPermissions,
  useRefreshPermissions,
} from "../hooks/usePermissionQueries";
import permissionService from "../api/service/permissionService";
import { Permission } from "../api/type";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { copyToClipboard, formatId } from "../utils/handleId";

interface TablePermissionProps {
  permissions: Permission[];
}

type SortKey = keyof Permission;
type SortOrder = "asc" | "desc";

const TablePermission = ({ permissions }: TablePermissionProps) => {
  const [permissionList, setPermissionList] = useState(permissions);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Filter permissions by name
  const filteredPermissions = permissionList.filter((permission) =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort permissions
  const sortedPermissions = [...filteredPermissions].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (sortKey === "createdAt") {
      return sortOrder === "asc"
        ? new Date(aValue).getTime() - new Date(bValue).getTime()
        : new Date(bValue).getTime() - new Date(aValue).getTime();
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return sortOrder === "asc"
      ? aValue > bValue
        ? 1
        : -1
      : bValue > aValue
      ? 1
      : -1;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedPermissions.length / itemsPerPage);
  const currentPermissions = sortedPermissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Sort handler
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  // Search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Parse apiRoutes safely
  const parseRoutes = (routes: string): { path: string; method: string }[] => {
    try {
      return JSON.parse(routes);
    } catch {
      return [];
    }
  };

  // Existing state and mutations
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [permissionToEdit, setPermissionToEdit] = useState<Permission | null>(
    null
  );
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isOpenConfirmMultiple, setIsOpenConfirmMultiple] = useState(false);
  const [idDelete, setIdDelete] = useState<string>("");

  const createPermissionMutation = useCreatePermissions();
  const editPermissionMutation = useEditPermissions();
  const deletePermissionMutation = useDeletePermissions();
  const refreshPermissionMutation = useRefreshPermissions();

  const handleCheckboxChange = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id)
        ? prev.filter((permissionId) => permissionId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPermissions(
      e.target.checked
        ? sortedPermissions.map((permission) => permission.id)
        : []
    );
  };

  const handleCreatePermission = () => setIsOpen(true);

  const onCreate = async (newPermission: Permission) => {
    try {
      createPermissionMutation.mutate(newPermission, {
        onSuccess(createPermission) {
          toast.success("Create permission successfully");
          setPermissionList((prev) => [...prev, createPermission]);
        },
      });
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to create permission");
    }
  };

  const handleClickRefresh = () => refreshPermissionMutation.refresh();

  const handleClickEdit = (permission: Permission) => {
    setPermissionToEdit(permission);
    setIsEditOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditOpen(false);
    setPermissionToEdit(null);
  };

  const handleEditPermission = async (updatedPermission: Permission) => {
    try {
      editPermissionMutation.mutate(updatedPermission, {
        onSuccess: () => toast.success("Permission updated successfully"),
      });
      setIsEditOpen(false);
    } catch (error) {
      toast.error("Failed to edit permission");
    }
  };

  const handleClickDeletePermission = (id: string) => {
    setIdDelete(id);
    setIsOpenConfirm(true);
  };

  const handleDeletePermission = async (id: string) => {
    try {
      deletePermissionMutation.mutate(id, {
        onSuccess: () => {
          const updatedPermissions = permissionList.filter(
            (permission) => permission.id !== id
          );
          setPermissionList(updatedPermissions);
          toast.success("Permission deleted successfully");
        },
      });
    } catch (error) {
      toast.error("Failed to delete permission");
    }
  };

  const handleDeleteSelected = () => {
    if (selectedPermissions.length === 0) {
      toast.warn("No permissions selected");
      return;
    }
    setIsOpenConfirmMultiple(true);
  };

  const handleDeleteSelectedPermissions = async () => {
    if (selectedPermissions.length === 0) {
      toast.warn("No permissions selected for deletion.");
      return;
    }

    try {
      const response = await permissionService.deleteMultiplePermissions(
        selectedPermissions
      );
      if (response.success) {
        const updatedPermissions = permissionList.filter(
          (permission) => !selectedPermissions.includes(permission.id)
        );
        setPermissionList(updatedPermissions);
        setSelectedPermissions([]);
        toast.success("Selected permissions deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete selected permissions");
    }
  };

  return (
    <div className="w-full bg-white dark:bg-background border p-5 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-1/3">
          <Input
            placeholder="Search by permission name..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        <div className="space-x-2">
          <Button
            onClick={handleCreatePermission}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" /> Create
          </Button>
          <Button onClick={handleClickRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button
            onClick={handleDeleteSelected}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Selected
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  selectedPermissions.length === sortedPermissions.length
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
              Permission Name <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("apiRoutes")}
            >
              Routes <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("description")}
            >
              Description <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("createdAt")}
            >
              Date Created <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPermissions.map((permission, index) => {
            const routes = parseRoutes(permission.apiRoutes);
            return (
              <TableRow key={index}>
                <TableCell>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(permission.id)}
                    checked={selectedPermissions.includes(permission.id)}
                  />
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="cursor-pointer hover:underline"
                          onClick={() => copyToClipboard(permission.id)}
                        >
                          {formatId(permission.id)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{permission.id}</p>
                        <p>Click to copy</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>{permission.name}</TableCell>
                <TableCell>
                  {routes.length > 0 ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {routes.slice(0, 2).map((route, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-full"
                              >
                                {route.method} {route.path}
                              </span>
                            ))}
                            {routes.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{routes.length - 2} more
                              </span>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <ul className="list-disc pl-4">
                            {routes.map((route, idx) => (
                              <li key={idx}>
                                {route.method} {route.path}
                              </li>
                            ))}
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span className="text-gray-500">No routes</span>
                  )}
                </TableCell>
                <TableCell>{permission.description}</TableCell>
                <TableCell>
                  {new Date(permission.createdAt).toISOString().split("T")[0]}
                </TableCell>
                <TableCell className="flex space-x-2">
                  <Button
                    onClick={() => handleClickEdit(permission)}
                    variant="outline"
                    size="icon"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleClickDeletePermission(permission.id)}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
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
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      <CreatePermission
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCreate={onCreate}
      />
      {permissionToEdit && (
        <EditPermission
          isOpen={isEditOpen}
          onClose={handleCloseEditModal}
          permissionToEdit={permissionToEdit}
          onEdit={handleEditPermission}
        />
      )}
      <DeleteConfirm
        isOpen={isOpenConfirm}
        onClose={() => setIsOpenConfirm(false)}
        onConfirm={handleDeletePermission}
        providerId={idDelete}
        type="Permission"
      />
      <DeleteMultipleConfirm
        isOpen={isOpenConfirmMultiple}
        onClose={() => setIsOpenConfirmMultiple(false)}
        onConfirm={handleDeleteSelectedPermissions}
        selectedArray={selectedPermissions}
        type="Permission"
      />
    </div>
  );
};

export default TablePermission;
