import { Search, RefreshCw, Trash2, Edit, Trash } from "lucide-react";
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
import { useState } from "react";
import { useDeleteLogs, useRefreshLogs } from "../hooks/useLogQueries";
import logService from "../api/service/logService";
import { toast } from "react-toastify";
import DeleteMultipleConfirm from "./confirmMultipleBox";
import DeleteConfirm from "./confirmBox";
import DetailLog from "./modalLog/detailLog";

interface Log {
  id: string;
  ip: string;
  user: string;
  event: string;
  created: string;
  context: object;
  rawEvent: object;
}

interface TableLogProps {
  logs: Log[];
}

const TableLog = ({ logs }: TableLogProps) => {
  const [logList, setLogList] = useState(logs);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const currentLogs = logs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [logToDetail, setLogDetail] = useState<Log | null>(null);

  const deleteLogMutation = useDeleteLogs();
  const refreshLogMutation = useRefreshLogs();

  const handleCheckboxChange = (id: string) => {
    setSelectedLogs((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]
    );
  };

  const handleClickRefresh = () => {
    refreshLogMutation.refresh();
  };

  const handleClickEdit = (log: Log) => {
    setLogDetail(log);
    setIsDetailOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsDetailOpen(false);
    setLogDetail({
      id: "",
      ip: "",
      user: "",
      event: "",
      created: "",
      context: [],
      rawEvent: [],
    });
  };

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [idDelete, setIdDelete] = useState<string>("");

  const handleClickDleteLog = (id: string) => {
    setIdDelete(id);
    setIsOpenConfirm(true);
  };
  const handleDeleteLog = async (id: string) => {
    try {
      deleteLogMutation.mutate(id, {
        onSuccess: () => {
          const updatedLogs = logList.filter((log) => log.id !== id);

          setLogList(updatedLogs);

          const newTotalPages = Math.ceil(updatedLogs.length / itemsPerPage);

          if (currentPage > newTotalPages) {
            setCurrentPage(newTotalPages || 1);
          }
          toast.success("Log deleted successfully");
        },
      });
    } catch (error) {
      toast.error("Failed to delete log");
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLogs(e.target.checked ? logs.map((app) => app.id) : []);
  };
  const [isOpenConfirmMultiple, setIsOpenConfirmMultiple] = useState(false);

  const handleDeleteSelected = () => {
    if (selectedLogs.length === 0) {
      toast.warn("No providers selected");
      return;
    }
    setIsOpenConfirmMultiple(true);
  };

  const handleDeleteSelectedLogs = async () => {
    if (selectedLogs.length === 0) {
      toast.warn("No logs selected for deletion.");
      return;
    }

    try {
      const response = await logService.deleteMultipleLogs(selectedLogs);
      if (response.success) {
        const updatedLogs = logList.filter(
          (log) => !selectedLogs.includes(log.id)
        );

        setLogList(updatedLogs);
        setSelectedLogs([]);

        const newTotalPages = Math.ceil(updatedLogs.length / itemsPerPage);

        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1);
        }

        toast.success("Selected logs deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete selected logs");
    }
  };

  return (
    <div className="w-full bg-white dark:bg-background border p-5 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-1/3">
          <Input placeholder="Search..." className="pl-10" />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        <div className="space-x-2">
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

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedLogs.length === logList.length}
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>IP</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentLogs.map((log, index) => (
            <TableRow key={index}>
              <TableCell>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(log.id)}
                  checked={selectedLogs.includes(log.id)}
                />
              </TableCell>
              <TableCell>{log.id}</TableCell>
              <TableCell>{log.ip}</TableCell>
              <TableCell>{log.user}</TableCell>
              <TableCell>{log.event}</TableCell>
              <TableCell>
                {new Date(log.created).toISOString().split("T")[0]}
              </TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  onClick={() => handleClickEdit(log)}
                  variant="outline"
                  size="icon"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleClickDleteLog(log.id)}
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

      {/* Pagination */}
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

      {logToDetail && (
        <DetailLog
          isOpen={isDetailOpen}
          onClose={handleCloseEditModal}
          log={logToDetail}
        />
      )}
      <DeleteConfirm
        isOpen={isOpenConfirm}
        onClose={() => setIsOpenConfirm(false)}
        onConfirm={handleDeleteLog}
        providerId={idDelete}
        type="Log"
      />

      <DeleteMultipleConfirm
        isOpen={isOpenConfirmMultiple}
        onClose={() => setIsOpenConfirmMultiple(false)}
        onConfirm={handleDeleteSelectedLogs}
        selectedArray={selectedLogs}
        type={"Log"}
      />
    </div>
  );
};

export default TableLog;
