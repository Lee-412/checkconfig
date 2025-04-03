// // EditApplicationModal.tsx
// import { useState, useEffect } from "react";
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import Textarea from "../../components/ui/textarea";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "../../components/ui/dialog";
// import { ChevronRight, ChevronLeft } from "lucide-react";
// import { toast } from "react-toastify";
// import { useGetTokens, useCreateToken } from "../../hooks/useTokenQueries";
// import {
//   useGetApplications,
//   useEditApplications,
// } from "../../hooks/useApplicationQueries";
// import { useGetProviders } from "../../hooks/useProviderQueries";

// interface EditApplicationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   applicationId: string;
// }

// const steps = ["Application", "Provider"];

// const EditApplicationModal = ({
//   isOpen,
//   onClose,
//   applicationId,
// }: EditApplicationModalProps) => {
//   const [step, setStep] = useState(0);
//   const [selectedTokenId, setSelectedTokenId] = useState("");
//   const [showTokenForm, setShowTokenForm] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch application details
//   const { data: application, isLoading: applicationLoading } =
//     useGetApplications(applicationId);

//   // Fetch token and provider details using IDs from application
//   const { data: token, isLoading: tokenLoading } = useGetTokens(
//     application?.tokenId || ""
//   );
//   const { data: provider, isLoading: providerLoading } = useGetProviders(
//     application?.providerId || ""
//   );

//   const [applicationData, setApplicationData] = useState({
//     id: applicationId,
//     name: "",
//     tokenId: "",
//     providerId: "",
//     adminId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//     createdAt: "",
//     updateAt: "",
//   });

//   const [providerData, setProviderData] = useState({
//     id: "",
//     name: "",
//     type: "",
//     applicationId: applicationId,
//     methodId: "",
//     methodName: "",
//     proxyHostIp: "",
//     domainName: "",
//     callbackUrl: "",
//     createdAt: "",
//     updateAt: "",
//   });

//   const [tokenData, setTokenData] = useState({
//     id: "",
//     body: {},
//     encryptToken: "",
//     expiredDuration: 0,
//     applicationId: "",
//   });

//   const [bodyInput, setBodyInput] = useState<string>("");

//   const { data: tokens, isLoading: tokensLoading } = useGetTokens();
//   const createToken = useCreateToken();
//   const editApplication = useEditApplication();

//   // Pre-fill data when fetched
//   useEffect(() => {
//     if (application && !applicationLoading) {
//       setApplicationData({
//         ...applicationData,
//         name: application.name,
//         tokenId: application.tokenId,
//         providerId: application.providerId || "",
//       });
//       setSelectedTokenId(application.tokenId);
//     }
//   }, [application, applicationLoading]);

//   useEffect(() => {
//     if (provider && !providerLoading) {
//       setProviderData(provider);
//     }
//   }, [provider, providerLoading]);

//   useEffect(() => {
//     if (token && !tokenLoading) {
//       setTokenData(token);
//       setBodyInput(JSON.stringify(token.body, null, 2));
//     }
//   }, [token, tokenLoading]);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >,
//     setData: React.Dispatch<React.SetStateAction<any>>
//   ) => {
//     const { name, value } = e.target;
//     if (name === "body") {
//       setBodyInput(value);
//       try {
//         const parsedBody = JSON.parse(value);
//         setTokenData((prev) => ({ ...prev, [name]: parsedBody }));
//       } catch (error) {
//         console.error("Invalid JSON in body:", error);
//         toast.error("Invalid JSON format in body.");
//       }
//     } else {
//       setData((prev: any) => ({
//         ...prev,
//         [name]: name === "expiredDuration" ? Number(value) : value,
//       }));
//     }
//   };

//   const handleTokenSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     if (value === "create") {
//       setShowTokenForm(true);
//       setSelectedTokenId("");
//     } else {
//       setShowTokenForm(false);
//       setSelectedTokenId(value);
//       setApplicationData((prev) => ({ ...prev, tokenId: value }));
//     }
//   };

//   const handleNext = async () => {
//     try {
//       setError(null);
//       if (step === 0) {
//         if (!applicationData.name)
//           throw new Error("Application name is required.");
//         if (!selectedTokenId && !showTokenForm)
//           throw new Error("Please select or create a token.");
//         if (showTokenForm) {
//           if (!tokenData.encryptToken || !bodyInput)
//             throw new Error("Please fill out all token fields.");
//           const tokenResponse = await createToken.mutateAsync({
//             ...tokenData,
//             applicationId: applicationId,
//           });
//           setSelectedTokenId(tokenResponse.id);
//           setApplicationData((prev) => ({
//             ...prev,
//             tokenId: tokenResponse.id,
//           }));
//         }
//         setStep(1);
//       } else if (step === 1) {
//         if (!providerData.name || !providerData.type)
//           throw new Error("Provider name and type are required.");
//         await editApplication.mutateAsync({
//           ...applicationData,
//           tokenId: selectedTokenId || applicationData.tokenId,
//           provider: providerData,
//         });
//         toast.success("Application updated successfully!");
//         onClose();
//       }
//     } catch (error: any) {
//       setError(error.message || "An error occurred.");
//       toast.error(error.message || "An error occurred.");
//     }
//   };

//   const handleBack = () => {
//     if (step === 1) {
//       setStep(0);
//     } else {
//       onClose();
//     }
//   };

//   if (applicationLoading || tokenLoading || providerLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl bg-white dark:bg-gray-800">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white">
//             Edit Application
//           </DialogTitle>
//         </DialogHeader>
//         <div className="p-6">
//           {error && (
//             <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
//               {error}
//             </div>
//           )}

//           {step === 0 && (
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
//                   Application Name
//                 </label>
//                 <Input
//                   name="name"
//                   value={applicationData.name}
//                   onChange={(e) => handleChange(e, setApplicationData)}
//                   placeholder="Enter application name"
//                   className="w-full"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
//                   Token
//                 </label>
//                 {tokensLoading ? (
//                   <p>Loading tokens...</p>
//                 ) : (
//                   <select
//                     name="tokenId"
//                     value={selectedTokenId}
//                     onChange={handleTokenSelect}
//                     className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
//                   >
//                     <option value="">Select a token</option>
//                     <option value="create">Create New Token</option>
//                     {tokens?.map((token: any) => (
//                       <option key={token.id} value={token.id}>
//                         {token.id}
//                       </option>
//                     ))}
//                   </select>
//                 )}
//               </div>
//               {showTokenForm && (
//                 <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border">
//                   <h3 className="text-lg font-semibold">Create New Token</h3>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">
//                       Body (JSON)
//                     </label>
//                     <Textarea
//                       name="body"
//                       value={bodyInput}
//                       onChange={(e) => handleChange(e, setTokenData)}
//                       placeholder='e.g. {"key": "value"}'
//                       className="w-full h-32"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">
//                       Encrypt Token
//                     </label>
//                     <Input
//                       name="encryptToken"
//                       value={tokenData.encryptToken}
//                       onChange={(e) => handleChange(e, setTokenData)}
//                       placeholder="Enter token encryption"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">
//                       Expiration Duration (seconds)
//                     </label>
//                     <Input
//                       type="number"
//                       name="expiredDuration"
//                       value={tokenData.expiredDuration}
//                       onChange={(e) => handleChange(e, setTokenData)}
//                       placeholder="e.g. 3600"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {step === 1 && (
//             <div className="space-y-6">
//               <div className="grid gap-6 md:grid-cols-2">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Provider Name
//                   </label>
//                   <Input
//                     name="name"
//                     value={providerData.name}
//                     onChange={(e) => handleChange(e, setProviderData)}
//                     placeholder="Enter provider name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Provider Type
//                   </label>
//                   <select
//                     name="type"
//                     value={providerData.type}
//                     onChange={(e) => handleChange(e, setProviderData)}
//                     className="w-full p-3 border rounded-lg"
//                   >
//                     <option value="">Select provider type</option>
//                     <option value="SAML">SAML</option>
//                     <option value="FORWARD">FORWARD</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Method Name
//                   </label>
//                   <Input
//                     name="methodName"
//                     value={providerData.methodName}
//                     onChange={(e) => handleChange(e, setProviderData)}
//                     placeholder="Enter method name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Proxy Host IP
//                   </label>
//                   <Input
//                     name="proxyHostIp"
//                     value={providerData.proxyHostIp}
//                     onChange={(e) => handleChange(e, setProviderData)}
//                     placeholder="e.g. 192.168.1.1"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Domain Name
//                   </label>
//                   <Input
//                     name="domainName"
//                     value={providerData.domainName}
//                     onChange={(e) => handleChange(e, setProviderData)}
//                     placeholder="e.g. example.com"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Callback URL
//                   </label>
//                   <Input
//                     name="callbackUrl"
//                     value={providerData.callbackUrl}
//                     onChange={(e) => handleChange(e, setProviderData)}
//                     placeholder="e.g. https://example.com/callback"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//         <DialogFooter>
//           <Button
//             onClick={handleBack}
//             variant="outline"
//             disabled={editApplication.isPending}
//             className="flex items-center"
//           >
//             <ChevronLeft className="w-5 h-5 mr-2" />
//             {step === 0 ? "Cancel" : "Back"}
//           </Button>
//           <Button
//             onClick={handleNext}
//             disabled={editApplication.isPending}
//             className="flex items-center"
//           >
//             {editApplication.isPending ? (
//               "Processing..."
//             ) : step === steps.length - 1 ? (
//               "Save"
//             ) : (
//               <>
//                 Next <ChevronRight className="w-5 h-5 ml-2" />
//               </>
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default EditApplicationModal;
