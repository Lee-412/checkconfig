import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  useCreateApplications,
  useDeleteApplications,
} from "../hooks/useApplicationQueries";
import { useCreateProviders } from "../hooks/useProviderQueries";
import { useCreateToken, useGetTokens } from "../hooks/useTokenQueries";
import Textarea from "../components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Clipboard, Download } from "lucide-react";
import { toast } from "react-toastify";
import { useGetAuthstreamjs, useGetNginx } from "../hooks/useForwardQueries";

const steps = ["Application", "Provider", "Templates"];
const providerTypes = [
  { id: "SAML", name: "SAML" },
  { id: "FORWARD", name: "FORWARD" },
];

const Forward = () => {
  const [step, setStep] = useState(0);
  const [applicationId, setApplicationId] = useState("");
  const [selectedTokenId, setSelectedTokenId] = useState("");
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [, setCreatedTokenId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: templateNginx } = useGetNginx(step === 2 ? applicationId : "");
  const { data: templateAuthstreamjs } = useGetAuthstreamjs(
    step === 2 ? applicationId : ""
  );

  const [applicationData, setApplicationData] = useState({
    id: "",
    name: "",
    providerId: "",
    tokenId: "",
    adminId: "",
    createdAt: "",
    updateAt: "",
  });

  const [providerData, setProviderData] = useState({
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

  const [tokenData, setTokenData] = useState({
    id: "",
    name: "",
    body: {},
    encryptToken: "",
    expiredDuration: 0,
  });

  const [bodyInput, setBodyInput] = useState<string>(
    JSON.stringify(tokenData.body, null, 2)
  );

  const createApplication = useCreateApplications();
  const deleteApplication = useDeleteApplications();
  const createProvider = useCreateProviders();
  const createToken = useCreateToken();
  const { data: tokens, isLoading: tokensLoading } = useGetTokens();
  const navigate = useNavigate();

  const handleNext = async () => {
    try {
      setError(null);
      if (step === 0) {
        if (!applicationData.name)
          throw new Error("Application name is required.");
        let tokenIdToUse;
        if (showTokenForm) {
          if (!tokenData.encryptToken || !bodyInput)
            throw new Error("Please fill out all token fields.");
          const tokenResponse = await createToken.mutateAsync({
            ...tokenData,
            applicationId: "",
          });
          tokenIdToUse = tokenResponse.id;
          setCreatedTokenId(tokenResponse.id);
          toast.success("Token created successfully!");
        } else {
          tokenIdToUse = selectedTokenId;
          if (!tokenIdToUse)
            throw new Error("Please select or create a token.");
        }

        const response = await createApplication.mutateAsync({
          ...applicationData,
          tokenId: tokenIdToUse,
          adminId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        });
        setApplicationId(response.id);
        setApplicationData((prev) => ({ ...prev, id: response.id }));
        toast.success("Application created successfully!");
        setStep(1);
      } else if (step === 1) {
        if (!providerData.name || !providerData.type)
          throw new Error("Provider name and type are required.");
        if (!applicationId) throw new Error("Application ID is missing.");
        await createProvider.mutateAsync({ ...providerData, applicationId });
        toast.success("Provider added successfully!");
        setStep(2);
      } else if (step === 2) {
        toast.success("Configuration completed!");
        navigate("/");
      }
    } catch (error: any) {
      setError(error.message || "An error occurred.");
      toast.error(error.message || "An error occurred.");
      console.error("Error during step transition:", error);
    }
  };

  const handleBack = async () => {
    if (step === 1) {
      try {
        setError(null);
        if (applicationId) {
          await deleteApplication.mutateAsync(applicationId);
          setApplicationId("");
          toast.info("Application deleted.");
        }
        setSelectedTokenId("");
        setBodyInput(JSON.stringify({}));
        setStep(0);
      } catch (error) {
        setError("Failed to go back. Please try again.");
        toast.error("Failed to go back. Please try again.");
        console.error("Error during back operation:", error);
      }
    } else if (step === 2) {
      setStep(1);
      toast.info("Returned to provider step.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    setData: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const { name, value } = e.target;
    if (name === "body") {
      setBodyInput(value);
      try {
        const parsedBody = JSON.parse(value);
        setTokenData((prev) => ({ ...prev, [name]: parsedBody }));
      } catch (error) {
        console.error("Invalid JSON in body:", error);
        toast.error("Invalid JSON format in body.");
      }
    } else {
      setData((prev: any) => ({
        ...prev,
        [name]: name === "expiredDuration" ? Number(value) : value,
      }));
    }
  };

  const handleTokenSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "create") {
      setShowTokenForm(true);
      setSelectedTokenId("");
    } else {
      setShowTokenForm(false);
      setSelectedTokenId(value);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Template copied to clipboard!");
  };

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success(`Template downloaded as ${filename}`);
  };

  return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className=" bg-gray-50 dark:bg-gray-700 p-6 border-r dark:border-gray-600">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
            Progress
          </h3>
          <div className="space-y-3">
            {steps.map((label, index) => (
              <div
                key={index}
                className={`flex items-center p-3 rounded-lg transition-all duration-300 cursor-pointer ${
                  index === step
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 font-semibold ${
                    index === step
                      ? "bg-white text-blue-600"
                      : "bg-gray-200 dark:bg-gray-500 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {index + 1}
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {step === 0 && (
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
                      className="w-1/4 p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    >
                      <option value="">Select a token</option>
                      <option value="create">Create New Token</option>
                      {tokens?.map((token: any) => (
                        <option key={token.id} value={token.id}>
                          {token.name
                            ? `${token.name} (${token.id})`
                            : token.id}
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
                        Name
                      </label>
                      <Input
                        name="name"
                        value={tokenData.name || ""}
                        onChange={(e) => handleChange(e, setTokenData)}
                        placeholder="Enter token name"
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Body (JSON)
                      </label>
                      <Textarea
                        name="body"
                        value={bodyInput}
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
                        value={tokenData.expiredDuration.toString()}
                        onChange={(e) => handleChange(e, setTokenData)}
                        placeholder="e.g. 3600"
                        min={0}
                        step={1}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 1 && (
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
                    onChange={(e) => handleChange(e, setProviderData)}
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
                    onChange={(e) => handleChange(e, setProviderData)}
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
                    onChange={(e) => handleChange(e, setProviderData)}
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
                    onChange={(e) => handleChange(e, setProviderData)}
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
                    onChange={(e) => handleChange(e, setProviderData)}
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
                    onChange={(e) => handleChange(e, setProviderData)}
                    placeholder="e.g. https://example.com/callback"
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                Templates
              </h2>
              <div className="grid gap-8">
                {/* Template 1 */}
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Nginx Config
                    </h3>
                  </div>
                  <pre className="bg-white dark:bg-gray-800 p-4 rounded-md text-sm overflow-auto border border-gray-200 dark:border-gray-600 relative">
                    <code className="text-gray-900 dark:text-gray-100">
                      {templateNginx}
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyToClipboard(templateNginx)}
                          className="flex items-center text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all p-1"
                        >
                          <Clipboard className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDownload(templateNginx, "nginx.conf")
                          }
                          className="flex items-center text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all p-1"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </code>
                  </pre>
                </div>

                {/* Template 2 */}
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      AuthStream.js
                    </h3>
                  </div>
                  <pre className="bg-white dark:bg-gray-800 p-4 rounded-md text-sm overflow-auto border border-gray-200 dark:border-gray-600 relative">
                    <code className="text-gray-900 dark:text-gray-100">
                      {templateAuthstreamjs}
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleCopyToClipboard(templateAuthstreamjs)
                          }
                          className="flex items-center text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all p-1"
                        >
                          <Clipboard className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDownload(
                              templateAuthstreamjs,
                              "authstream.js"
                            )
                          }
                          className="flex items-center text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all p-1"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10 gap-4">
            {step > 0 && (
              <Button
                onClick={handleBack}
                variant="outline"
                disabled={
                  createApplication.isPending ||
                  createProvider.isPending ||
                  step === 2
                }
                className="w-full md:w-auto flex items-center justify-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg px-6 py-2 transition-all"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={createApplication.isPending || createProvider.isPending}
              className="w-full md:w-auto flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-6 py-2 transition-all"
            >
              {createApplication.isPending || createProvider.isPending ? (
                "Processing..."
              ) : step === steps.length - 1 ? (
                "Finish"
              ) : step === 0 ? (
                <>
                  Next <ChevronRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </div>
      </div>
  );
};

export default Forward;
