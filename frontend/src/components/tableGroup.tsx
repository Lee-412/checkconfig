import { useState } from "react";
import {
  Search,
  Plus,
  RefreshCw,
  Trash2,
  Edit,
  Trash,
  ArrowUpDown,
  Eye,
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
import CreateGroup from "./modalGroup/createGroup";
import EditGroup from "./modalGroup/editGroup";
import DeleteConfirm from "./confirmBox";
import DeleteMultipleConfirm from "./confirmMultipleBox";
import { toast } from "react-toastify";
import {
  useCreateGroups,
  useDeleteGroups,
  useEditGroups,
  useRefreshGroups,
} from "../hooks/useGroupQueries";
import groupService from "../api/service/groupService";
import { Group } from "../api/type";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { copyToClipboard, formatId } from "../utils/handleId";
import GroupUsersModal from "./modalGroup/groupUser";

interface TableGroupProps {
  groups: Group[];
}

type SortKey = keyof Group;
type SortOrder = "asc" | "desc";

const TableGroup = ({ groups }: TableGroupProps) => {
  const [groupList, setGroupList] = useState(groups);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedGroupName, setSelectedGroupName] = useState<string>("");
  // Filter groups by name
  const filteredGroups = groupList.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShowUsers = (group: Group) => {
    setSelectedGroupId(group.id);
    setSelectedGroupName(group.name);
    setIsUsersModalOpen(true);
  };
  // Sort groups
  const sortedGroups = [...filteredGroups].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedGroups.length / itemsPerPage);
  const currentGroups = sortedGroups.slice(
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
  const [groupToEdit, setGroupToEdit] = useState<Group | null>(null);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isOpenConfirmMultiple, setIsOpenConfirmMultiple] = useState(false);
  const [idDelete, setIdDelete] = useState<string>("");

  const createGroupMutation = useCreateGroups();
  const editGroupMutation = useEditGroups();
  const deleteGroupMutation = useDeleteGroups();
  const refreshGroupMutation = useRefreshGroups();

  const handleCheckboxChange = (id: string) => {
    setSelectedGroups((prev) =>
      prev.includes(id)
        ? prev.filter((groupId) => groupId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedGroups(
      e.target.checked ? sortedGroups.map((group) => group.id) : []
    );
  };

  const handleCreateGroup = () => setIsOpen(true);

  const onCreate = async (newGroup: Group) => {
    try {
      createGroupMutation.mutate(newGroup, {
        onSuccess(createGroup) {
          toast.success("create group successfully");
          setGroupList((prev) => [...prev, createGroup]);
        },
      });
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to create group");
    }
  };

  const handleClickRefresh = () => refreshGroupMutation.refresh();

  const handleClickEdit = (group: Group) => {
    setGroupToEdit(group);
    setIsEditOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditOpen(false);
    setGroupToEdit(null);
  };

  const handleEditGroup = async (updatedGroup: Group) => {
    try {
      editGroupMutation.mutate(updatedGroup, {
        onSuccess: () => toast.success("Group updated successfully"),
      });
      setIsEditOpen(false);
    } catch (error) {
      toast.error("Failed to edit group");
    }
  };

  const handleClickDeleteGroup = (id: string) => {
    setIdDelete(id);
    setIsOpenConfirm(true);
  };

  const handleDeleteGroup = async (id: string) => {
    try {
      deleteGroupMutation.mutate(id, {
        onSuccess: () => {
          const updatedGroups = groupList.filter((group) => group.id !== id);
          setGroupList(updatedGroups);
          toast.success("Group deleted successfully");
        },
      });
    } catch (error) {
      toast.error("Failed to delete group");
    }
  };

  const handleDeleteSelected = () => {
    if (selectedGroups.length === 0) {
      toast.warn("No groups selected");
      return;
    }
    setIsOpenConfirmMultiple(true);
  };

  const handleDeleteSelectedGroups = async () => {
    if (selectedGroups.length === 0) {
      toast.warn("No groups selected for deletion.");
      return;
    }

    try {
      const response = await groupService.deleteMultipleGroups(selectedGroups);
      if (response.success) {
        const updatedGroups = groupList.filter(
          (group) => !selectedGroups.includes(group.id)
        );
        setGroupList(updatedGroups);
        setSelectedGroups([]);
        toast.success("Selected groups deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete selected groups");
    }
  };

  return (
    <div className="w-full bg-white dark:bg-background border p-5 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-1/3">
          <Input
            placeholder="Search by group name..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        <div className="space-x-2">
          <Button
            onClick={handleCreateGroup}
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
                checked={selectedGroups.length === sortedGroups.length}
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
              Groupname <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("roleId")}
            >
              Role <ArrowUpDown className="inline w-4 h-4 ml-1" />
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
          {currentGroups.map((group, index) => (
            <TableRow key={index}>
              <TableCell>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(group.id)}
                  checked={selectedGroups.includes(group.id)}
                />
              </TableCell>

              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className="cursor-pointer hover:underline"
                        onClick={() => copyToClipboard(group.id)}
                      >
                        {formatId(group.id)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{group.id}</p>
                      <p>Click to copy</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>

              <TableCell>{group.name}</TableCell>
              <TableCell>{group.roleId}</TableCell>
              <TableCell>{group.description}</TableCell>
              <TableCell>
                {new Date(group.createdAt).toISOString().split("T")[0]}
              </TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShowUsers(group)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleClickEdit(group)}
                  variant="outline"
                  size="icon"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleClickDeleteGroup(group.id)}
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

      <CreateGroup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCreate={onCreate}
      />
      {groupToEdit && (
        <EditGroup
          isOpen={isEditOpen}
          onClose={handleCloseEditModal}
          groupToEdit={groupToEdit}
          onEdit={handleEditGroup}
        />
      )}

      {selectedGroupId && (
        <GroupUsersModal
          isOpen={isUsersModalOpen}
          onClose={() => {
            setIsUsersModalOpen(false);
            setSelectedGroupId(null);
            setSelectedGroupName("");
          }}
          groupId={selectedGroupId}
          groupName={selectedGroupName}
        />
      )}
      <DeleteConfirm
        isOpen={isOpenConfirm}
        onClose={() => setIsOpenConfirm(false)}
        onConfirm={handleDeleteGroup}
        providerId={idDelete}
        type="Group"
      />
      <DeleteMultipleConfirm
        isOpen={isOpenConfirmMultiple}
        onClose={() => setIsOpenConfirmMultiple(false)}
        onConfirm={handleDeleteSelectedGroups}
        selectedArray={selectedGroups}
        type="Group"
      />
    </div>
  );
};

export default TableGroup;
