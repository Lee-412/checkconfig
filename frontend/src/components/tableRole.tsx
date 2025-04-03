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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { copyToClipboard, formatId } from "../utils/handleId";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import CreateRole from "./modalRole/createRole";
import EditRole from "./modalRole/editRole";
import DeleteConfirm from "./confirmBox";
import DeleteMultipleConfirm from "./confirmMultipleBox";
import { toast } from "react-toastify";
import {
  useCreateRoles,
  useDeleteRoles,
  useEditRoles,
  useRefreshRoles,
} from "../hooks/useRoleQueries";
import roleService from "../api/service/roleService";
import { Role } from "../api/type";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";

interface TableRoleProps {
  roles: Role[];
}

type SortKey = keyof Role;
type SortOrder = "asc" | "desc";

export const useFetchRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await axiosClient.get("/roles");
      return response.data as Role[];
    },
  });
};

const TableRole = ({ roles }: TableRoleProps) => {
  const [roleList, setRoleList] = useState(roles);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Filter roles by name
  const filteredRoles = roleList.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort roles
  const sortedRoles = [...filteredRoles].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedRoles.length / itemsPerPage);
  const currentRoles = sortedRoles.slice(
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

  // Existing state and mutations
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isOpenConfirmMultiple, setIsOpenConfirmMultiple] = useState(false);
  const [idDelete, setIdDelete] = useState<string>("");

  const createRoleMutation = useCreateRoles();
  const editRoleMutation = useEditRoles();
  const deleteRoleMutation = useDeleteRoles();
  const refreshRoleMutation = useRefreshRoles();

  const handleCheckboxChange = (id: string) => {
    setSelectedRoles((prev) =>
      prev.includes(id) ? prev.filter((roleId) => roleId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRoles(
      e.target.checked ? sortedRoles.map((role) => role.id) : []
    );
  };

  const handleCreateRole = () => setIsOpen(true);

  const onCreate = async (newRole: Role) => {
    try {
      if (!newRole.name.trim()) {
        toast.error("Role name is required");
        return;
      }
      try {
        const parsedPermissions = JSON.parse(newRole.permissionId);
        if (
          !Array.isArray(parsedPermissions) ||
          parsedPermissions.length === 0
        ) {
          toast.error("At least one permission ID is required");
          return;
        }
      } catch {
        toast.error("Invalid permission ID format");
        return;
      }

      console.log("New role: ", newRole);

      createRoleMutation.mutate(newRole, {
        onSuccess: (createdRole) => {
          toast.success(`Role ${newRole.name} created successfully`);
          setRoleList((prev) => [...prev, createdRole]); // Thêm role mới vào state
        },
        onError: (error) => {
          console.error("Error creating role: ", error);
          toast.error(error.message);
        },
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Unexpected error in onCreate: ", error);
      toast.error("Failed to create role");
    }
  };
  const handleClickRefresh = () => refreshRoleMutation.refresh();

  const handleClickEdit = (role: Role) => {
    setRoleToEdit(role);
    setIsEditOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditOpen(false);
    setRoleToEdit(null);
  };

  const handleEditRole = async (updatedRole: Role) => {
    try {
      console.log("fucking update role: ", updatedRole);

      editRoleMutation.mutate(updatedRole, {
        onSuccess: (updatedData) => {
          toast.success("Role updated successfully");
          // Cập nhật roleList thủ công
          setRoleList((prev) =>
            prev.map((role) =>
              role.id === updatedRole.id ? { ...role, ...updatedData } : role
            )
          );
        },
        onError: () => {
          toast.error("Failed to edit role");
        },
      });
      setIsEditOpen(false);
    } catch (error) {
      toast.error("Failed to edit role");
    }
  };

  const handleClickDeleteRole = (id: string) => {
    setIdDelete(id);
    setIsOpenConfirm(true);
  };

  const handleDeleteRole = async (id: string) => {
    try {
      deleteRoleMutation.mutate(id, {
        onSuccess: () => {
          const updatedRoles = roleList.filter((role) => role.id !== id);
          setRoleList(updatedRoles);
          toast.success("Role deleted successfully");
        },
      });
    } catch (error) {
      toast.error("Failed to delete role");
    }
  };

  const handleDeleteSelected = () => {
    if (selectedRoles.length === 0) {
      toast.warn("No roles selected");
      return;
    }
    setIsOpenConfirmMultiple(true);
  };

  const handleDeleteSelectedRoles = async () => {
    if (selectedRoles.length === 0) {
      toast.warn("No roles selected for deletion.");
      return;
    }

    try {
      const response = await roleService.deleteMultipleRoles(selectedRoles);
      if (response.success) {
        const updatedRoles = roleList.filter(
          (role) => !selectedRoles.includes(role.id)
        );
        setRoleList(updatedRoles);
        setSelectedRoles([]);
        toast.success("Selected roles deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete selected roles");
    }
  };

  return (
    <div className="w-full bg-white dark:bg-background border p-5 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-1/3">
          <Input
            placeholder="Search by role name..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        <div className="space-x-2">
          <Button
            onClick={handleCreateRole}
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
                checked={selectedRoles.length === sortedRoles.length}
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
              RoleName <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("groupId")}
            >
              Group <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("permissionId")}
            >
              Permission <ArrowUpDown className="inline w-4 h-4 ml-1" />
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
          {currentRoles.map((role, index) => (
            <TableRow key={index}>
              <TableCell>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(role.id)}
                  checked={selectedRoles.includes(role.id)}
                />
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className="cursor-pointer hover:underline"
                        onClick={() => copyToClipboard(role.id)}
                      >
                        {formatId(role.id)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{role.id}</p>
                      <p>Click to copy</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>{role.name}</TableCell>
              <TableCell>{role.groupId}</TableCell>
              <TableCell>{role.permissionId}</TableCell>
              <TableCell>
                {new Date(role.createdAt).toISOString().split("T")[0]}
              </TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  onClick={() => handleClickEdit(role)}
                  variant="outline"
                  size="icon"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleClickDeleteRole(role.id)}
                  variant="destructive"
                  size="icon"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
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

      <CreateRole
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCreate={onCreate}
      />
      {roleToEdit && (
        <EditRole
          isOpen={isEditOpen}
          onClose={handleCloseEditModal}
          roleToEdit={roleToEdit}
          onEdit={handleEditRole}
        />
      )}
      <DeleteConfirm
        isOpen={isOpenConfirm}
        onClose={() => setIsOpenConfirm(false)}
        onConfirm={handleDeleteRole}
        providerId={idDelete}
        type="Role"
      />
      <DeleteMultipleConfirm
        isOpen={isOpenConfirmMultiple}
        onClose={() => setIsOpenConfirmMultiple(false)}
        onConfirm={handleDeleteSelectedRoles}
        selectedArray={selectedRoles}
        type="Role"
      />
    </div>
  );
};

export default TableRole;
