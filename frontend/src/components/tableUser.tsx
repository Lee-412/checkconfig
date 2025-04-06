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
import CreateUser from "./modalUser/createUser";
import EditUser from "./modalUser/editUser";
import DeleteConfirm from "./confirmBox";
import DeleteMultipleConfirm from "./confirmMultipleBox";
import { toast } from "react-toastify";
import {
  useCreateUsers,
  useDeleteUsers,
  useEditUsers,
  useRefreshUsers,
  useCreateBulkUsers,
} from "../hooks/useUserQueries";
import userService from "../api/service/userService";
import ImportUser from "./modalUser/importUser";
import { User } from "../api/type";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { copyToClipboard, formatId } from "../utils/handleId";
interface TableUserProps {
  users: User[];
}

type SortKey = keyof User;
type SortOrder = "asc" | "desc";

const TableUser = ({ users }: TableUserProps) => {
  const [userList, setUserList] = useState(users);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Filter users by username
  const filteredUsers = userList.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const currentUsers = sortedUsers.slice(
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
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isOpenConfirmMultiple, setIsOpenConfirmMultiple] = useState(false);
  const [idDelete, setIdDelete] = useState<string>("");

  const createUserMutation = useCreateUsers();
  const editUserMutation = useEditUsers();
  const deleteUserMutation = useDeleteUsers();
  const refreshUserMutation = useRefreshUsers();
  const createBulkUsersMutation = useCreateBulkUsers();

  const handleCheckboxChange = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedUsers(
      e.target.checked ? sortedUsers.map((user) => user.id) : []
    );
  };

  const handleCreateUser = () => setIsOpen(true);

  const onCreate = async (newUser: User) => {
    try {
      createUserMutation.mutate(newUser);
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to create user");
    }
  };

  const handleClickRefresh = () => refreshUserMutation.refresh();

  const handleClickEdit = (user: User) => {
    setUserToEdit(user);
    setIsEditOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditOpen(false);
    setUserToEdit(null);
  };

  const handleEditUser = async (updatedUser: User) => {
    try {
      editUserMutation.mutate(updatedUser, {
        onSuccess: () => toast.success("User updated successfully"),
      });
      setIsEditOpen(false);
    } catch (error) {
      toast.error("Failed to edit user");
    }
  };

  const handleClickDeleteUser = (id: string) => {
    setIdDelete(id);
    setIsOpenConfirm(true);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      deleteUserMutation.mutate(id, {
        onSuccess: () => {
          const updatedUsers = userList.filter((user) => user.id !== id);
          setUserList(updatedUsers);
          toast.success("User deleted successfully");
        },
      });
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleDeleteSelected = () => {
    if (selectedUsers.length === 0) {
      toast.warn("No users selected");
      return;
    }
    setIsOpenConfirmMultiple(true);
  };

  const handleDeleteSelectedUsers = async () => {
    if (selectedUsers.length === 0) {
      toast.warn("No users selected for deletion.");
      return;
    }

    try {
      const response = await userService.deleteMultipleUsers(selectedUsers);
      if (response.success) {
        const updatedUsers = userList.filter(
          (user) => !selectedUsers.includes(user.id)
        );
        setUserList(updatedUsers);
        setSelectedUsers([]);
        toast.success("Selected users deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete selected users");
    }
  };

  const handleImportUsers = async (fileContent: File) => {
    try {
      createBulkUsersMutation.mutate(fileContent, {
        onSuccess: () => {
          toast.success("Users imported successfully");
          setIsImportOpen(false);
        },
        onError: (error) => {
          toast.error("Failed to import users: " + error.message);
        },
      });
    } catch (error) {
      toast.error("Failed to import users");
    }
  };

  return (
    <div className="w-full bg-white dark:bg-background border p-5 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-1/3">
          <Input
            placeholder="Search by username..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        <div className="space-x-2">
          <Button
            onClick={() => setIsImportOpen(true)}
            className="bg-green-500 text-white hover:bg-green-600"
          >
            <Plus className="w-4 h-4 mr-2" /> Import CSV
          </Button>
          <Button
            onClick={handleCreateUser}
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
                checked={selectedUsers.length === sortedUsers.length}
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
              onClick={() => handleSort("username")}
            >
              Username <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead>
            {/* <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("password")}
            >
              Password <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead> */}
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
          {currentUsers.map((user, index) => (
            <TableRow key={index}>
              <TableCell>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(user.id)}
                  checked={selectedUsers.includes(user.id)}
                />
              </TableCell>

              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className="cursor-pointer hover:underline"
                        onClick={() => copyToClipboard(user.id)}
                      >
                        {formatId(user.id)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{user.id}</p>
                      <p>Click to copy</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>{user.username}</TableCell>
              {/* <TableCell>{user.password}</TableCell> */}
              <TableCell>
                {new Date(user.createdAt).toISOString().split("T")[0]}
              </TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  onClick={() => handleClickEdit(user)}
                  variant="outline"
                  size="icon"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleClickDeleteUser(user.id)}
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

      <CreateUser
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCreate={onCreate}
      />
      {userToEdit && (
        <EditUser
          isOpen={isEditOpen}
          onClose={handleCloseEditModal}
          userToEdit={userToEdit}
          onEdit={handleEditUser}
        />
      )}
      <ImportUser
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImportUsers}
      />
      <DeleteConfirm
        isOpen={isOpenConfirm}
        onClose={() => setIsOpenConfirm(false)}
        onConfirm={handleDeleteUser}
        providerId={idDelete}
        type="User"
      />
      <DeleteMultipleConfirm
        isOpen={isOpenConfirmMultiple}
        onClose={() => setIsOpenConfirmMultiple(false)}
        onConfirm={handleDeleteSelectedUsers}
        selectedArray={selectedUsers}
        type="User"
      />
    </div>
  );
};

export default TableUser;
