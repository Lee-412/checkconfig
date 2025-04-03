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
import { useGetProviders } from "../../hooks/useProviderQueries";
import { useGetTokens } from "../../hooks/useTokenQueries";
import { Application } from "../../api/type";
import { useNavigate } from "react-router-dom";

interface CreateApplicationProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (application: Application) => void;
}

const CreateApplication = ({
  isOpen,
  onClose,
  onCreate,
}: CreateApplicationProps) => {
  const { data: providers, isLoading: providersLoading } = useGetProviders();
  const { data: tokens, isLoading: tokensLoading } = useGetTokens();
  const navigate = useNavigate();

  const [newApplication, setNewApplication] = useState<Application>({
    id: "",
    name: "",
    providerId: "",
    tokenId: "",
    adminId: "",
    createdAt: "",
    updateAt: "",
  });

  const [selectedTokenId, setSelectedTokenId] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewApplication((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTokenSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTokenId(value);
    setNewApplication((prev) => ({ ...prev, tokenId: value }));
  };

  const resetForm = () => {
    setNewApplication({
      id: "",
      name: "",
      providerId: "",
      tokenId: "",
      adminId: "",
      createdAt: "",
      updateAt: "",
    });
    setSelectedTokenId("");
  };

  const handleCreate = () => {
    const trimmedName = newApplication.name.trim();

    if (!trimmedName) {
      toast.warning("Application name is required.");
      return;
    }

    if (!selectedTokenId) {
      toast.warning("Please select a token.");
      return;
    }

    onCreate({
      ...newApplication,
      name: trimmedName,
      tokenId: selectedTokenId,
      adminId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    });

    resetForm();
    onClose();
    toast.success("Application created successfully!");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleNavigateToProvider = () => {
    navigate("/provider");
  };

  const handleNavigateToToken = () => {
    navigate("/token");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Application</DialogTitle>
          <DialogDescription>
            Enter application details and select an existing token.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="name"
            value={newApplication.name}
            onChange={handleChange}
            placeholder="Application Name"
          />

          <div className="flex items-center space-x-2">
            {providersLoading ? (
              <p className="flex-1">Loading providers...</p>
            ) : providers && Array.isArray(providers) ? (
              <select
                name="providerId"
                value={newApplication.providerId}
                onChange={handleChange}
                className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-600 text-sm"
              >
                <option value="">Select Provider</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name
                      ? `${provider.name} (${provider.id})`
                      : provider.id}
                  </option>
                ))}
              </select>
            ) : (
              <p className="flex-1 text-red-500">No Providers Found</p>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleNavigateToProvider}
            >
              New Provider
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {tokensLoading ? (
              <p className="flex-1">Loading tokens...</p>
            ) : tokens && tokens.length > 0 ? (
              <select
                name="tokenId"
                value={selectedTokenId}
                onChange={handleTokenSelect}
                className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-600 text-sm"
              >
                <option value="">Select a Token</option>
                {tokens.map((token: any) => (
                  <option key={token.id} value={token.id}>
                    {token.name ? `${token.name} (${token.id})` : token.id}
                  </option>
                ))}
              </select>
            ) : (
              <p className="flex-1 text-red-500">No Tokens Found</p>
            )}
            <Button variant="outline" size="sm" onClick={handleNavigateToToken}>
              New Token
            </Button>
          </div>
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

export default CreateApplication;
