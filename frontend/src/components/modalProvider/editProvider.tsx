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
import { ProviderType } from "../../api/type";
import { useGetApplications } from "../../hooks/useApplicationQueries";

const providerTypes = [
  { id: "SAML", name: "SAML" },
  { id: "FORWARD", name: "FORWARD" },
];

interface EditProviderProps {
  isOpen: boolean;
  onClose: () => void;
  providerToEdit: ProviderType;
  onEdit: (updatedProvider: ProviderType) => void;
}

const EditProvider = ({
  isOpen,
  onClose,
  providerToEdit,
  onEdit,
}: EditProviderProps) => {
  const [editedProvider, setEditedProvider] = useState<ProviderType | null>(
    null
  );
  const { data: applications, isLoading } = useGetApplications();

  useEffect(() => {
    if (providerToEdit) {
      setEditedProvider(providerToEdit);
    }
  }, [providerToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (editedProvider) {
      setEditedProvider((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  const handleEdit = () => {
    if (!editedProvider) return;
    if (
      !editedProvider.name ||
      !editedProvider.type ||
      !editedProvider.applicationId
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    onEdit(editedProvider);
    onClose();
  };

  if (!editedProvider) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Provider</DialogTitle>
          <DialogDescription>
            Update the details of the provider.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="name"
            value={editedProvider.name}
            onChange={handleChange}
            placeholder="Provider Name"
          />
          <select
            name="type"
            value={editedProvider.type}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-600 text-sm"
          >
            <option value="">Select Provider Type</option>
            {providerTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {isLoading ? (
            <p>Loading applications...</p>
          ) : applications && Array.isArray(applications) ? (
            <select
              name="applicationId"
              value={editedProvider.applicationId}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-600 text-sm"
            >
              <option value="">Select Application</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.name}
                </option>
              ))}
            </select>
          ) : (
            <Button className="w-full bg-red-500 text-white hover:bg-red-600">
              No Applications Found - Create One
            </Button>
          )}
          <Input
            name="methodId"
            value={editedProvider.methodId}
            onChange={handleChange}
            placeholder="Method Name"
          />
          <Input
            name="proxyHostIp"
            value={editedProvider.proxyHostIp}
            onChange={handleChange}
            placeholder="Proxy Host IP"
          />
          <Input
            name="domainName"
            value={editedProvider.domainName}
            onChange={handleChange}
            placeholder="Domain"
          />
          <Input
            name="callbackUrl"
            value={editedProvider.callbackUrl}
            onChange={handleChange}
            placeholder="Callback URL"
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

export default EditProvider;
