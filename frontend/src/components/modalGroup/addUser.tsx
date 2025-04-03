import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { UserGroup, User } from "../../api/type";
import { useGetUsers } from "../../hooks/useUserQueries";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { copyToClipboard, formatId } from "../../utils/handleId";

interface AddUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
  existingUserIds: string[];
  onAddUsers: (userGroups: UserGroup[]) => void;
}

const AddUsersModal = ({
  isOpen,
  onClose,
  groupId,
  groupName,
  existingUserIds,
  onAddUsers,
}: AddUsersModalProps) => {
  const { data: allUsers = [], isLoading } = useGetUsers();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const availableUsers = allUsers.filter(
    (user) => !existingUserIds.includes(user.id)
  );

  const handleToggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = () => {
    const newUserGroups = selectedUserIds.map((userId) => ({
      userId,
      groupId,
      createdAt: "",
      updatedAt: "",
    }));
    // console.log(newUserGroups);
    onAddUsers(newUserGroups);
    setSelectedUserIds([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[400px]">
        <DialogHeader>
          <DialogTitle>Add Users to {groupName}</DialogTitle>
          <DialogDescription>
            Select users to add to this group
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div>Loading users...</div>
        ) : (
          <div className="overflow-y-auto max-h-[calc(400px-140px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Select</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableUsers.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => handleToggleUser(user.id)}
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
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleSubmit}
            disabled={selectedUserIds.length === 0 || isLoading}
          >
            Add Selected Users
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUsersModal;
