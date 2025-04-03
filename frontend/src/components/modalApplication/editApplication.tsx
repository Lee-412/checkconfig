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
import { Application } from "../../api/type";
import { useGetProviders } from "../../hooks/useProviderQueries";
import { useGetTokens } from "../../hooks/useTokenQueries";
import { useNavigate } from "react-router-dom";

interface EditApplicationProps {
  isOpen: boolean;
  onClose: () => void;
  applicationToEdit: Application | null;
  onEdit: (updatedApplication: Application) => void;
}

const EditApplication = ({
  isOpen,
  onClose,
  applicationToEdit,
  onEdit,
}: EditApplicationProps) => {
  const { data: providers, isLoading: providersLoading } = useGetProviders();
  const { data: tokens, isLoading: tokensLoading } = useGetTokens();
  const navigate = useNavigate();

  const [editedApplication, setEditedApplication] =
    useState<Application | null>(null);

  useEffect(() => {
    if (applicationToEdit) {
      setEditedApplication(applicationToEdit);
    }
  }, [applicationToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (editedApplication) {
      setEditedApplication((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  const handleEdit = () => {
    if (editedApplication) {
      onEdit(editedApplication);
      onClose();
    }
  };

  const handleNavigateToToken = () => {
    navigate("/token");
  };

  if (!editedApplication) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Application</DialogTitle>
          <DialogDescription>
            Update the details of the application.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="name"
            value={editedApplication.name}
            onChange={handleChange}
            placeholder="Application Name"
          />

          <div className="flex items-center space-x-2">
            {providersLoading ? (
              <p className="flex-1">Loading providers...</p>
            ) : providers && Array.isArray(providers) ? (
              <select
                name="providerId"
                value={editedApplication.providerId}
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
              onClick={() => navigate("/provider")}
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
                value={editedApplication.tokenId}
                onChange={handleChange}
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

export default EditApplication;
