import { Search, Plus, RefreshCw, Trash2, Edit, Trash } from "lucide-react";
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
import CreateMessage from "./modalMessage/createMessage";
import { useState } from "react";
import EditMessage from "./modalMessage/editMessage";
import {
  useCreateMessages,
  useDeleteMessages,
  useEditMessages,
  useRefreshMessages,
} from "../hooks/useMessageQueries";
import messageService from "../api/service/messageService";
import { toast } from "react-toastify";
import DeleteMultipleConfirm from "./confirmMultipleBox";
import DeleteConfirm from "./confirmBox";

interface Message {
  id: string;
  name: string;
  type: string;
  body: string;
  created: string;
}

interface TableMessageProps {
  messages: Message[];
}

const TableMessage = ({ messages }: TableMessageProps) => {
  const [messageList, setMessageList] = useState(messages);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(messages.length / itemsPerPage);
  const currentMessages = messages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [messageToEdit, setMessageToEdit] = useState<Message | null>(null);

  const createMessageMutation = useCreateMessages();
  const editMessageMutation = useEditMessages();
  const deleteMessageMutation = useDeleteMessages();
  const refreshMessageMutation = useRefreshMessages();

  const onClose = () => {
    setIsOpen(false);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedMessages((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]
    );
  };

  const onCreate = async (newMessage: Message) => {
    try {
      createMessageMutation.mutate(newMessage);
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to create message");
    }
  };

  const handleCreateMessage = () => {
    setIsOpen(true);
  };

  const handleClickRefresh = () => {
    refreshMessageMutation.refresh();
  };

  const handleClickEdit = (message: Message) => {
    setMessageToEdit(message);
    setIsEditOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditOpen(false);
    setMessageToEdit({
      id: "",
      name: "",
      type: "",
      body: "",
      created: "",
    });
  };

  const handleEditMessage = async (updatedMessage: Message) => {
    try {
      editMessageMutation.mutate(updatedMessage, {
        onSuccess: () => {
          toast.success("Tokens Eit successfully");
        },
      });
      setIsEditOpen(false);
    } catch (error) {
      toast.error("Failed to edit message");
    }
  };
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [idDelete, setIdDelete] = useState<string>("");

  const handleClickDleteMessage = (id: string) => {
    setIdDelete(id);
    setIsOpenConfirm(true);
  };
  const handleDeleteMessage = async (id: string) => {
    try {
      deleteMessageMutation.mutate(id, {
        onSuccess: () => {
          const updatedMessages = messageList.filter(
            (message) => message.id !== id
          );

          setMessageList(updatedMessages);

          const newTotalPages = Math.ceil(
            updatedMessages.length / itemsPerPage
          );

          if (currentPage > newTotalPages) {
            setCurrentPage(newTotalPages || 1);
          }
          toast.success("Message deleted successfully");
        },
      });
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMessages(e.target.checked ? messages.map((app) => app.id) : []);
  };
  const [isOpenConfirmMultiple, setIsOpenConfirmMultiple] = useState(false);

  const handleDeleteSelected = () => {
    if (selectedMessages.length === 0) {
      toast.warn("No providers selected");
      return;
    }
    setIsOpenConfirmMultiple(true);
  };

  const handleDeleteSelectedMessages = async () => {
    if (selectedMessages.length === 0) {
      toast.warn("No messages selected for deletion.");
      return;
    }

    try {
      const response = await messageService.deleteMultipleMessages(
        selectedMessages
      );
      if (response.success) {
        const updatedMessages = messageList.filter(
          (message) => !selectedMessages.includes(message.id)
        );

        setMessageList(updatedMessages);
        setSelectedMessages([]);

        const newTotalPages = Math.ceil(updatedMessages.length / itemsPerPage);

        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1);
        }

        toast.success("Selected messages deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete selected messages");
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
          <Button
            onClick={handleCreateMessage}
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

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedMessages.length === messageList.length}
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentMessages.map((message, index) => (
            <TableRow key={index}>
              <TableCell>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(message.id)}
                  checked={selectedMessages.includes(message.id)}
                />
              </TableCell>
              <TableCell>{message.id}</TableCell>
              <TableCell>{message.name}</TableCell>
              <TableCell>{message.type}</TableCell>
              <TableCell>
                {new Date(message.created).toISOString().split("T")[0]}
              </TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  onClick={() => handleClickEdit(message)}
                  variant="outline"
                  size="icon"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleClickDleteMessage(message.id)}
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

      <CreateMessage isOpen={isOpen} onClose={onClose} onCreate={onCreate} />
      {messageToEdit && (
        <EditMessage
          isOpen={isEditOpen}
          onClose={handleCloseEditModal}
          messageToEdit={messageToEdit}
          onEdit={handleEditMessage}
        />
      )}
      <DeleteConfirm
        isOpen={isOpenConfirm}
        onClose={() => setIsOpenConfirm(false)}
        onConfirm={handleDeleteMessage}
        providerId={idDelete}
        type="Message"
      />

      <DeleteMultipleConfirm
        isOpen={isOpenConfirmMultiple}
        onClose={() => setIsOpenConfirmMultiple(false)}
        onConfirm={handleDeleteSelectedMessages}
        selectedArray={selectedMessages}
        type={"Message"}
      />
    </div>
  );
};

export default TableMessage;
