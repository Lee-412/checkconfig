import { Input } from "../../components/ui/input";
import Textarea from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { ChevronRight } from "lucide-react";

const ApplicationForm = ({
  applicationData,
  setApplicationData,
  tokenData,
  setTokenData,
  selectedTokenId,
  setSelectedTokenId,
  showTokenForm,
  setShowTokenForm,
  tokens,
  tokensLoading,
  handleNext,
  step,
  stepsLength,
  isPending,
}) => {
  const handleChange = (e, setData) => {
    const { name, value } = e.target;
    if (name === "body") {
      try {
        const parsedBody = JSON.parse(value);
        setTokenData((prev) => ({ ...prev, [name]: parsedBody }));
      } catch (error) {
        console.error("Invalid JSON in body:", error);
      }
    } else {
      setData((prev) => ({
        ...prev,
        [name]: name === "expiredDuration" ? Number(value) : value,
      }));
    }
  };

  const handleTokenSelect = (e) => {
    const value = e.target.value;
    if (value === "create") {
      setShowTokenForm(true);
      setSelectedTokenId("");
    } else {
      setShowTokenForm(false);
      setSelectedTokenId(value);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
        Create Application
      </h2>
      <div className="grid gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Application Name
          </label>
          <Input
            name="name"
            value={applicationData.name}
            onChange={(e) => handleChange(e, setApplicationData)}
            placeholder="Enter application name"
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Token
          </label>
          {tokensLoading ? (
            <p className="text-gray-500 dark:text-gray-400">
              Loading tokens...
            </p>
          ) : (
            <select
              name="tokenId"
              value={selectedTokenId}
              onChange={handleTokenSelect}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">Select a token</option>
              <option value="create">Create New Token</option>
              {tokens?.map((token) => (
                <option key={token.id} value={token.id}>
                  {token.id}
                </option>
              ))}
            </select>
          )}
        </div>
        {showTokenForm && (
          <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Create New Token
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Body (JSON)
              </label>
              <Textarea
                name="body"
                value={JSON.stringify(tokenData.body, null, 2)}
                onChange={(e) => handleChange(e, setTokenData)}
                placeholder='e.g. {"key": "value"}'
                className="w-full h-32 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Encrypt Token
              </label>
              <Input
                name="encryptToken"
                value={tokenData.encryptToken}
                onChange={(e) => handleChange(e, setTokenData)}
                placeholder="Enter token encryption"
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Expiration Duration (seconds)
              </label>
              <Input
                type="number"
                name="expiredDuration"
                value={tokenData.expiredDuration}
                onChange={(e: any) => handleChange(e, setTokenData)}
                placeholder="e.g. 3600"
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end mt-10 gap-4">
        <Button
          onClick={handleNext}
          disabled={isPending}
          className="w-full md:w-auto flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-6 py-2 transition-all"
        >
          {isPending ? (
            "Processing..."
          ) : (
            <>
              Next <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ApplicationForm;
