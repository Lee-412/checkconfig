import { useState } from "react";
import { Button } from "../ui/button";
import Textarea from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Token } from "../../api/type";

interface CreateTokenProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (token: Token) => void;
}

const CreateToken = ({ isOpen, onClose, onCreate }: CreateTokenProps) => {
  const [newToken, setNewToken] = useState<Token>({
    id: "",
    name: "", // Added name field
    body: {},
    encryptToken: "",
    expiredDuration: 0,
    applicationId: "",
  });

  const [bodyInput, setBodyInput] = useState<string>(
    JSON.stringify(newToken.body, null, 2)
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "body") {
      setBodyInput(value);
      try {
        const parsedBody = JSON.parse(value);
        setNewToken((prev) => ({
          ...prev,
          [name]: parsedBody,
        }));
      } catch (error) {
        console.error("Invalid JSON in body:", error);
      }
    } else {
      setNewToken((prev) => ({
        ...prev,
        [name]: name === "expiredDuration" ? Number(value) : value,
      }));
    }
  };

  const handleCreate = () => {
    if (typeof newToken.body === "string" || !isValidJSON(bodyInput)) {
      console.error("Body must be valid JSON before creating token");
      return;
    }
    if (!newToken.name.trim()) {
      console.error("Name is required");
      return;
    }
    onCreate(newToken);
    setNewToken({
      id: "",
      name: "", // Reset name
      body: {},
      encryptToken: "",
      expiredDuration: 0,
      applicationId: "",
    });
    setBodyInput("{}");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Token</DialogTitle>
          <DialogDescription>
            Enter the details of the new token.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="name" // Added name input
            value={newToken.name}
            onChange={handleChange}
            placeholder="Token Name"
          />
          <Textarea
            name="body"
            value={bodyInput}
            onChange={handleChange}
            placeholder='Body (JSON format, e.g. {"key": "value"})'
          />
          <Input
            name="encryptToken"
            value={newToken.encryptToken}
            onChange={handleChange}
            placeholder="Token Encrypt"
          />
          <Input
            type="number"
            name="expiredDuration"
            value={newToken.expiredDuration.toString()}
            onChange={handleChange}
            placeholder="Token Expired Duration"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleCreate}
            disabled={!isValidJSON(bodyInput) || !newToken.name.trim()}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const isValidJSON = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

export default CreateToken;
