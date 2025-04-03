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
import { Input } from "../ui/input";
import { toast } from "react-toastify";
import Textarea from "../ui/textarea";

interface Message {
  id: string;
  name: string;
  type: string;
  created: string;
  body: string;
}

interface CreateMessageProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (message: Message) => void;
}

const CreateMessage = ({ isOpen, onClose, onCreate }: CreateMessageProps) => {
  const [newMessage, setNewMessage] = useState<Message>({
    id: "",
    name: "",
    type: "",
    created: "",
    body: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewMessage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetMessage = () => {
    setNewMessage({
      id: "",
      name: "",
      type: "",
      created: "",
      body: "",
    });
  };

  const handleCreate = () => {
    const { id, name, type, body } = newMessage;

    const trimmedId = id.trim();
    const trimmedName = name.trim();
    const trimmedType = type.trim();
    const trimmedBody = body.trim();

    if (!trimmedId || !trimmedName || !trimmedType || !trimmedBody) {
      toast.warning("All fields are required and cannot be empty.");
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(trimmedId)) {
      toast.warning("Message ID must only contain letters and numbers.");

      return;
    }

    if (trimmedBody.length < 8) {
      toast.warning("Message Body must be at least 8 characters long.");
      return;
    }

    onCreate({
      ...newMessage,
      id: trimmedId,
      name: trimmedName,
      type: trimmedType,
      body: trimmedBody,
      created: new Date().toISOString(),
    });
    resetMessage();
    onClose();
  };

  // const handleCreate = () => {
  //   //validate data ở đây

  //   onCreate(newMessage);
  //   resetMessage();
  //   onClose();
  // };

  const handleClose = () => {
    resetMessage();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Message</DialogTitle>
          <DialogDescription>
            Enter the details of the new message.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="id"
            value={newMessage.id}
            onChange={handleChange}
            placeholder="Message ID"
          />
          <Input
            name="name"
            value={newMessage.name}
            onChange={handleChange}
            placeholder="Message Name"
          />
          <Input
            name="type"
            value={newMessage.type}
            onChange={handleChange}
            placeholder="Message Type"
          />
          <Textarea
            name="body"
            value={newMessage.body}
            onChange={handleChange}
            placeholder="Body"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleCreate}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMessage;
