import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";

interface Message {
  id: string;
  name: string;
  type: string;
  body: string;
  created: string;
}

interface EditMessageProps {
  isOpen: boolean;
  onClose: () => void;
  messageToEdit: Message | null;
  onEdit: (updatedMessage: Message) => void;
}

const EditMessage = ({
  isOpen,
  onClose,
  messageToEdit,
  onEdit,
}: EditMessageProps) => {
  const [editedMessage, setEditedMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (messageToEdit) {
      setEditedMessage(messageToEdit);
    }
  }, [messageToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (editedMessage) {
      setEditedMessage((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  const handleEdit = () => {
    if (editedMessage) {
      onEdit(editedMessage);
      onClose();
    }
  };

  if (!editedMessage) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
          <DialogDescription>
            Update the details of the message.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="id"
            value={editedMessage.id}
            onChange={handleChange}
            placeholder="Message ID"
            disabled
          />
          <Input
            name="name"
            value={editedMessage.name}
            onChange={handleChange}
            placeholder="Message Name"
          />
          <Input
            name="type"
            value={editedMessage.type}
            onChange={handleChange}
            placeholder="Message Type"
          />
          <Input
            name="body"
            value={editedMessage.body}
            onChange={handleChange}
            placeholder="Message Body"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleEdit}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditMessage;
