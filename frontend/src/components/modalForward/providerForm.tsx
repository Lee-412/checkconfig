import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { ChevronLeft } from "lucide-react";

const providerTypes = [
  { id: "SAML", name: "SAML" },
  { id: "FORWARD", name: "FORWARD" },
];

const ProviderForm = ({
  providerData,
  setProviderData,
  handleNext,
  handleBack,
  step,
  stepsLength,
  isPending,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProviderData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
        Add Provider
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Provider Name
          </label>
          <Input
            name="name"
            value={providerData.name}
            onChange={handleChange}
            placeholder="Enter provider name"
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Provider Type
          </label>
          <select
            name="type"
            value={providerData.type}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="">Select provider type</option>
            {providerTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Method Name
          </label>
          <Input
            name="methodName"
            value={providerData.methodName}
            onChange={handleChange}
            placeholder="Enter method name"
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Proxy Host IP
          </label>
          <Input
            name="proxyHostIp"
            value={providerData.proxyHostIp}
            onChange={handleChange}
            placeholder="e.g. 192.168.1.1"
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Domain Name
          </label>
          <Input
            name="domainName"
            value={providerData.domainName}
            onChange={handleChange}
            placeholder="e.g. example.com"
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Callback URL
          </label>
          <Input
            name="callbackUrl"
            value={providerData.callbackUrl}
            onChange={handleChange}
            placeholder="e.g. https://example.com/callback"
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
      <div className="flex justify-between mt-10 gap-4">
        <Button
          onClick={handleBack}
          variant="outline"
          disabled={isPending}
          className="w-full md:w-auto flex items-center justify-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg px-6 py-2 transition-all"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={isPending}
          className="w-full md:w-auto flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-6 py-2 transition-all"
        >
          {isPending ? "Processing..." : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default ProviderForm;
