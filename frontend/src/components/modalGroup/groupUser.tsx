import { useState, useEffect, useMemo } from "react";
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
import { Trash, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { UserGroup, User } from "../../api/type";
import {
  useGetUserGroups,
  useCreateUserGroups,
  useDeleteUserInGroups,
} from "../../hooks/useGroupQueries";
import { useGetUserById, useDeleteUsers } from "../../hooks/useUserQueries";
import AddUsersModal from "./addUser";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { copyToClipboard, formatId } from "../../utils/handleId";

interface GroupUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
}

const GroupUsersModal = ({
  isOpen,
  onClose,
  groupId,
  groupName,
}: GroupUsersModalProps) => {
  const { data: userGroups = [], isFetching } = useGetUserGroups();
  const getUserByIdMutation = useGetUserById();
  // const deleteUserMutation = useDeleteUsers();
  const createUserGroupsMutation = useCreateUserGroups();
  const deleteUserGroupsMutation = useDeleteUserInGroups();
  const [isAddUsersOpen, setIsAddUsersOpen] = useState(false);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { refetch } = useGetUserGroups(); // Get the refetch function

  const groupUsers = useMemo(
    () => userGroups.filter((ug: UserGroup) => ug.groupId === groupId),
    [userGroups, groupId]
  );

  useEffect(() => {
    groupUsers.forEach((userGroup: UserGroup) => {
      if (!usersData.some((user) => user.id === userGroup.userId)) {
        getUserByIdMutation.mutate(userGroup.userId, {
          onSuccess: (user) => {
            setUsersData((prev) => [...prev, user]);
          },
          onError: (error) => {
            toast.error(
              `Failed to fetch user ${userGroup.userId}: ${error.message}`
            );
          },
        });
      }
    });
  }, [groupUsers]);

  const totalPages = Math.ceil(groupUsers.length / itemsPerPage);
  const currentUsers = useMemo(
    () =>
      groupUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [groupUsers, currentPage]
  );

  const handleDeleteUser = (userId: string, groupId: string) => {
    deleteUserGroupsMutation.mutate(
      { idUserDelete: userId, idGroupDelete: groupId }, 
      {
        onSuccess: () => {
          toast.success(`User ${userId} removed successfully`);
          setUsersData((prev) => prev.filter((user) => user.id !== userId));
        },
        onError: (error) => {
          toast.error(`Failed to remove user ${userId}: ${error.message}`);
        },
      }
    );
  };
  

  const handleAddUsers = (newUserGroups: UserGroup[]) => {
    newUserGroups.forEach((userGroup) => {
      createUserGroupsMutation.mutate(userGroup, {
        onSuccess: () => {
          toast.success(`User ${userGroup.userId} added successfully`);
          getUserByIdMutation.mutate(userGroup.userId, {
            onSuccess: (user) => {
              setUsersData((prev) => [...prev, user]);
            },
            onError: (error) => {
              toast.error(
                `Failed to fetch user ${userGroup.userId}: ${error.message}`
              );
            },
          });
        },
        onError: (error) => {
          toast.error(
            `Failed to add user ${userGroup.userId}: ${error.message}`
          );
        },
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Users in {groupName}</DialogTitle>
          <DialogDescription>Manage users in this group</DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <Button
            onClick={() => setIsAddUsersOpen(true)}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Users
          </Button>
        </div>

        {isFetching ? (
          <div>Loading group users...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((userGroup: UserGroup) => {
                const user = usersData.find((u) => u.id === userGroup.userId);
                return (
                  <TableRow key={userGroup.userId}>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className="cursor-pointer hover:underline"
                              onClick={() => copyToClipboard(userGroup.userId)}
                            >
                              {formatId(userGroup.userId)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{userGroup.userId}</p>
                            <p>Click to copy</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{user ? user.username : "Loading..."}</TableCell>
                    <TableCell>
                      {new Date(userGroup.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteUser(userGroup.userId, userGroup.groupId)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        <div className="flex justify-between items-center mt-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>

        <AddUsersModal
          isOpen={isAddUsersOpen}
          onClose={() => setIsAddUsersOpen(false)}
          groupId={groupId}
          groupName={groupName}
          existingUserIds={groupUsers.map((ug) => ug.userId)}
          onAddUsers={handleAddUsers}
        />
      </DialogContent>
    </Dialog>
  );
};

export default GroupUsersModal;
