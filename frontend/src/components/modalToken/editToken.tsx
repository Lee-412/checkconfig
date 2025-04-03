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
import Textarea from "../ui/textarea";
import { Token } from "../../api/type";

interface EditTokenProps {
  isOpen: boolean;
  onClose: () => void;
  tokenToEdit: Token | null;
  onEdit: (updatedToken: Token) => void;
}

const isValidJSON = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

const EditToken = ({
  isOpen,
  onClose,
  tokenToEdit,
  onEdit,
}: EditTokenProps) => {
  const [editedToken, setEditedToken] = useState<Token | null>(null);
  const [bodyInput, setBodyInput] = useState<string>("");

  useEffect(() => {
    if (tokenToEdit) {
      setEditedToken(tokenToEdit);
      setBodyInput(JSON.stringify(tokenToEdit.body, null, 2));
    }
  }, [tokenToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (editedToken) {
      if (name === "body") {
        setBodyInput(value);
        try {
          const parsedBody = JSON.parse(value);
          setEditedToken((prev) => ({
            ...prev!,
            [name]: parsedBody,
          }));
        } catch (error) {
          console.error("Invalid JSON in body:", error);
        }
      } else {
        setEditedToken((prev) => ({
          ...prev!,
          [name]: name === "expiredDuration" ? Number(value) : value,
        }));
      }
    }
  };

  const handleEdit = () => {
    if (editedToken && isValidJSON(bodyInput) && editedToken.name.trim()) {
      onEdit(editedToken);
      onClose();
    } else {
      console.error(
        "Cannot save: Body must be valid JSON and name is required"
      );
    }
  };

  if (!editedToken) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Token</DialogTitle>
          <DialogDescription>
            Update the details of the token.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="id"
            value={editedToken.id}
            onChange={handleChange}
            placeholder="Token ID"
            disabled
          />
          <Input
            name="name" // Added name input
            value={editedToken.name}
            onChange={handleChange}
            placeholder="Token Name"
          />
          <Input
            name="encryptToken"
            value={editedToken.encryptToken}
            onChange={handleChange}
            placeholder="Token Encrypt"
          />
          <Textarea
            name="body"
            value={bodyInput}
            onChange={handleChange}
            placeholder='Body (JSON format, e.g. {"key": "value"})'
          />
          <Input
            name="expiredDuration"
            type="number"
            value={editedToken.expiredDuration}
            onChange={handleChange}
            placeholder="Token Expired"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleEdit}
            disabled={!isValidJSON(bodyInput) || !editedToken.name.trim()}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditToken;
