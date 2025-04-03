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
import CreateProvider from "./modalProvider/createProvider";
import { useState } from "react";
import EditProvider from "./modalProvider/editProvider";
import { ProviderType } from "../api/type";
import {
  useCreateProviders,
  useDeleteMultipleProvider,
  useDeleteProviders,
  useEditProviders,
} from "../hooks/useProviderQueries";
import { toast } from "react-toastify";
import DeleteConfirm from "./confirmBox";
import DeleteMultipleConfirm from "./confirmMultipleBox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { copyToClipboard, formatId } from "../utils/handleId";

interface TableProviderProps {
  providers: ProviderType[];
}

type SortKey = keyof ProviderType;
type SortOrder = "asc" | "desc";

const TableProvider = ({ providers }: TableProviderProps) => {
  const [providerList, setProviderList] = useState(providers);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Filter providers by name
  const filteredProviders = providerList.filter((provider) =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort providers
  const sortedProviders = [...filteredProviders].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedProviders.length / itemsPerPage);
  const currentProviders = sortedProviders.slice(
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
  const [providerToEdit, setProviderToEdit] = useState<ProviderType | null>(
    null
  );
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isOpenConfirmMultiple, setIsOpenConfirmMultiple] = useState(false);
  const [idDelete, setIdDelete] = useState<string>("");

  const createProviderMutation = useCreateProviders();
  const editProviderMutation = useEditProviders();
  const deleteProviderMutation = useDeleteProviders();
  const deleteMultipleProviderMutation = useDeleteMultipleProvider();

  const handleCheckboxChange = (id: string) => {
    setSelectedProviders((prev) =>
      prev.includes(id)
        ? prev.filter((providerId) => providerId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProviders(
      e.target.checked ? sortedProviders.map((t) => t.id) : []
    );
  };

  const onCreate = async (newProvider: ProviderType) => {
    try {
      createProviderMutation.mutate(newProvider, {
        onSuccess: () => toast.success("Provider created successfully"),
      });
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to create Provider");
    }
  };

  const handleCreateProvider = () => setIsOpen(true);

  const handleEditProvider = async (updatedProvider: ProviderType) => {
    try {
      editProviderMutation.mutate(updatedProvider, {
        onSuccess: () => toast.success("Provider updated successfully"),
      });
      setIsEditOpen(false);
    } catch (error) {
      toast.error("Failed to edit Provider");
    }
  };

  const handleClickDeleteProvider = (id: string) => {
    setIdDelete(id);
    setIsOpenConfirm(true);
  };

  const handleDeleteProvider = (id: string) => {
    try {
      deleteProviderMutation.mutate(id, {
        onSuccess: () => {
          const updatedProvider = providerList.filter(
            (provider) => provider.id !== id
          );
          setProviderList(updatedProvider);
          toast.success("Provider deleted successfully");
        },
      });
    } catch (error) {
      toast.error("Something went wrong with delete provider");
    }
  };

  const handleDeleteSelected = () => {
    if (selectedProviders.length === 0) {
      toast.warn("No providers selected");
      return;
    }
    setIsOpenConfirmMultiple(true);
  };

  const handleDeleteSelectedProviders = async () => {
    if (selectedProviders.length === 0) {
      toast.warn("No providers selected");
      return;
    }
    try {
      deleteMultipleProviderMutation.mutate(selectedProviders, {
        onSuccess: () => {
          const updatedProvider = providerList.filter(
            (provider) => !selectedProviders.includes(provider.id)
          );
          setProviderList(updatedProvider);
          setSelectedProviders([]);
          toast.success("Providers deleted successfully");
        },
      });
    } catch (error) {
      toast.error("Failed to delete selected providers");
    }
  };

  return (
    <div className="w-full bg-white dark:bg-background border p-5 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-1/3">
          <Input
            placeholder="Search by name..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        <div className="space-x-2">
          <Button
            onClick={handleCreateProvider}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" /> Create
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button
            onClick={handleDeleteSelected}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete
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
                checked={selectedProviders.length === sortedProviders.length}
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
              onClick={() => handleSort("type")}
            >
              Type <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("domainName")}
            >
              Domain <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("applicationId")}
            >
              Application <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("callbackUrl")}
            >
              CallBack Url <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("createdAt")}
            >
              Created <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProviders.map((provider) => (
            <TableRow key={provider.id}>
              <TableCell>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(provider.id)}
                  checked={selectedProviders.includes(provider.id)}
                />
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className="cursor-pointer hover:underline"
                        onClick={() => copyToClipboard(provider.id)}
                      >
                        {formatId(provider.id)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{provider.id}</p>
                      <p>Click to copy</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>{provider.name}</TableCell>
              <TableCell>{provider.type}</TableCell>
              <TableCell>{provider.domainName}</TableCell>
              <TableCell>{provider.applicationId}</TableCell>
              <TableCell>{provider.callbackUrl}</TableCell>
              <TableCell>{provider.createdAt}</TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  onClick={() => {
                    setProviderToEdit(provider);
                    setIsEditOpen(true);
                  }}
                  variant="outline"
                  size="icon"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleClickDeleteProvider(provider.id)}
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

      <CreateProvider
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCreate={onCreate}
      />
      {providerToEdit && (
        <EditProvider
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          providerToEdit={providerToEdit}
          onEdit={handleEditProvider}
        />
      )}
      <DeleteConfirm
        isOpen={isOpenConfirm}
        onClose={() => setIsOpenConfirm(false)}
        onConfirm={handleDeleteProvider}
        providerId={idDelete}
        type="Provider"
      />
      <DeleteMultipleConfirm
        isOpen={isOpenConfirmMultiple}
        onClose={() => setIsOpenConfirmMultiple(false)}
        onConfirm={handleDeleteSelectedProviders}
        selectedArray={selectedProviders}
        type="Provider"
      />
    </div>
  );
};

export default TableProvider;
