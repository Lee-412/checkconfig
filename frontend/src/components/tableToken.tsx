import {
  Search,
  Plus,
  Edit,
  Trash,
  Trash2,
  RefreshCw,
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
import CreateToken from "./modalToken/createToken";
import { useState } from "react";
import EditToken from "./modalToken/editToken";
import {
  useCreateToken,
  useEditToken,
  useDeleteToken,
  useDeleteMultipleToken,
} from "../hooks/useTokenQueries";
import { toast } from "react-toastify";
import { Token } from "../api/type";
import DeleteConfirm from "./confirmBox";
import DeleteMultipleConfirm from "./confirmMultipleBox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { copyToClipboard, formatId } from "../utils/handleId";

interface TableTokenProps {
  tokens: Token[];
}

type SortKey = keyof Token;
type SortOrder = "asc" | "desc";

const TableToken = ({ tokens }: TableTokenProps) => {
  const [tokenList, setTokenList] = useState(tokens);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Filter tokens by encryptToken or name
  const filteredTokens = tokenList.filter(
    (token) =>
      token.encryptToken.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (token.name &&
        token.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort tokens
  const sortedTokens = [...filteredTokens].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

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
  const totalPages = Math.ceil(sortedTokens.length / itemsPerPage);
  const currentTokens = sortedTokens.slice(
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
  const [tokenToEdit, setTokenToEdit] = useState<Token | null>(null);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isOpenConfirmMultiple, setIsOpenConfirmMultiple] = useState(false);
  const [idDelete, setIdDelete] = useState<string>("");

  const createTokenMutation = useCreateToken();
  const editTokenMutation = useEditToken();
  const deleteTokenMutation = useDeleteToken();
  const deleteMultipleTokenMutation = useDeleteMultipleToken();

  const handleCheckboxChange = (id: string) => {
    setSelectedTokens((prev) =>
      prev.includes(id)
        ? prev.filter((tokenId) => tokenId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTokens(e.target.checked ? sortedTokens.map((t) => t.id) : []);
  };

  const onCreate = async (newToken: Token) => {
    try {
      createTokenMutation.mutate(newToken, {
        onSuccess: (createdToken) => {
          setTokenList((prev) => [...prev, createdToken]);
          toast.success("Token created successfully");
          setIsOpen(false);
        },
        onError: () => {
          toast.error("Failed to create token");
        },
      });
    } catch (error) {
      toast.error("Failed to create token");
    }
  };

  const handleCreateToken = () => setIsOpen(true);

  const handleEditToken = async (updatedToken: Token) => {
    try {
      editTokenMutation.mutate(updatedToken, {
        onSuccess: () => toast.success("Token updated successfully"),
      });
      setIsEditOpen(false);
    } catch (error) {
      toast.error("Failed to edit token");
    }
  };

  const handleClickDeleteToken = (id: string) => {
    setIdDelete(id);
    setIsOpenConfirm(true);
  };

  const handleDeleteToken = async (id: string) => {
    try {
      deleteTokenMutation.mutate(id, {
        onSuccess: () => {
          const updatedTokens = tokenList.filter((token) => token.id !== id);
          setTokenList(updatedTokens);
          toast.success("Token deleted successfully");
        },
      });
    } catch (error) {
      toast.error("Failed to delete token");
    }
  };

  const handleDeleteSelected = () => {
    if (selectedTokens.length === 0) {
      toast.warn("No tokens selected");
      return;
    }
    setIsOpenConfirmMultiple(true);
  };

  const handleDeleteSelectedTokens = () => {
    if (selectedTokens.length === 0) {
      toast.warn("No tokens selected");
      return;
    }
    try {
      deleteMultipleTokenMutation.mutate(selectedTokens, {
        onSuccess: () => {
          const updatedToken = tokenList.filter(
            (token) => !selectedTokens.includes(token.id)
          );
          setTokenList(updatedToken);
          setSelectedTokens([]);
          toast.success("Tokens deleted successfully");
        },
      });
    } catch (error) {
      toast.error("Failed to delete selected tokens");
    }
  };

  return (
    <div className="w-full bg-white dark:bg-background border p-5 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-1/3">
          <Input
            placeholder="Search by name or encrypt token..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        <div className="space-x-2">
          <Button
            onClick={handleCreateToken}
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
                checked={selectedTokens.length === sortedTokens.length}
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
              onClick={() => handleSort("encryptToken")}
            >
              Encrypt Token <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("expiredDuration")}
            >
              Expired <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTokens.map((token) => (
            <TableRow key={token.id}>
              <TableCell>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(token.id)}
                  checked={selectedTokens.includes(token.id)}
                />
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className="cursor-pointer hover:underline"
                        onClick={() => copyToClipboard(token.id)}
                      >
                        {formatId(token.id)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{token.id}</p>
                      <p>Click to copy</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>{token.name || "N/A"}</TableCell>
              <TableCell>{token.encryptToken}</TableCell>
              <TableCell>{token.expiredDuration}</TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    setTokenToEdit(token);
                    setIsEditOpen(true);
                  }}
                  variant="outline"
                  size="icon"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleClickDeleteToken(token.id)}
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

      <CreateToken
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCreate={onCreate}
      />
      {tokenToEdit && (
        <EditToken
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          tokenToEdit={tokenToEdit}
          onEdit={handleEditToken}
        />
      )}
      <DeleteConfirm
        isOpen={isOpenConfirm}
        onClose={() => setIsOpenConfirm(false)}
        onConfirm={handleDeleteToken}
        providerId={idDelete}
        type="Token"
      />
      <DeleteMultipleConfirm
        isOpen={isOpenConfirmMultiple}
        onClose={() => setIsOpenConfirmMultiple(false)}
        onConfirm={handleDeleteSelectedTokens}
        selectedArray={selectedTokens}
        type="Token"
      />
    </div>
  );
};

export default TableToken;
