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
import { ProviderType } from "../../api/type";
import { useGetApplications } from "../../hooks/useApplicationQueries";

const providerTypes = [
  { id: "SAML", name: "SAML" },
  { id: "FORWARD", name: "FORWARD" },
];

interface CreateProviderProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (provider: ProviderType) => void;
}

const CreateProvider = ({ isOpen, onClose, onCreate }: CreateProviderProps) => {
  const { data: applications, isLoading } = useGetApplications();

  const [newProvider, setNewProvider] = useState<ProviderType>({
    id: "",
    name: "",
    type: "",
    applicationId: "",
    methodId: "",
    methodName: "",
    proxyHostIp: "",
    domainName: "",
    callbackUrl: "",
    createdAt: "",
    updateAt: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewProvider((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = () => {
    if (!newProvider.name || !newProvider.type) {
      alert("Please fill in all required fields.");
      return;
    }

    onCreate(newProvider);
    setNewProvider({
      id: "",
      name: "",
      type: "",
      applicationId: "",
      methodId: "",
      methodName: "",
      proxyHostIp: "",
      domainName: "",
      callbackUrl: "",
      createdAt: "",
      updateAt: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Provider</DialogTitle>
          <DialogDescription>
            Enter the details of the new provider.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="name"
            value={newProvider.name}
            onChange={handleChange}
            placeholder="Provider Name"
          />
          <select
            name="type"
            value={newProvider.type}
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
              value={newProvider.applicationId}
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
            name="methodName"
            value={newProvider.methodName}
            onChange={handleChange}
            placeholder="Method"
          />
          <Input
            name="proxyHostIp"
            value={newProvider.proxyHostIp}
            onChange={handleChange}
            placeholder="Proxy Host IP"
          />
          <Input
            name="domainName"
            value={newProvider.domainName}
            onChange={handleChange}
            placeholder="Domain"
          />
          <Input
            name="callbackUrl"
            value={newProvider.callbackUrl}
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
            onClick={handleCreate}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProvider;
