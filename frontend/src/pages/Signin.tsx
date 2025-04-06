import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { JWT_LOCAL_STORAGE_KEY } from "../constants/data";
import {
  useCheckConnection,
  useGetSchema,
  useLogin,
  usePreviewData,
  useRegister,
  useSubmitConfig,
  useSubmitTableConfig,
} from "../hooks/useSigninQueries";
import RegisterModal from "../components/modalSignin/registerModal";
import ConfigDBModal from "../components/modalSignin/configDbModal";
import ViewSchemaModal from "../components/modalSignin/viewSchemaModal";
import PreviewDataModal from "../components/modalSignin/previewDataModal";
import TableConfigModal from "../components/modalSignin/tableConfigModal";
import { AxiosError } from "axios";
import {
  DbConfig,
  dbSchema,
  RegisterData,
  SigninData,
  TableConfig,
  TableData,
  tableSchema,
} from "../api/type";
import LoadingBar from "../components/LoadingBar";
import { useConnectionStore } from "../utils/connectionStore";
import { getConnectionString } from "../utils/dbConnectionStore";

const SignIn = () => {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({
    id: "",
    username: "",
    password: "",
  });
  const [schema, setSchema] = useState<dbSchema>({
    databaseName: "",
    databaseSchema: [],
  });
  const [previewData, setPreviewData] = useState<TableData[]>([]);
  const [config, setConfig] = useState<DbConfig>({
    id: "",
    username: "",
    password: "",
    uri: "",
    databaseUsername: "",
    databasePassword: "",
    databaseType: "",
    sslMode: "",
    host: "",
    port: 0,
    connectionString: "",
    tableIncludeList: [],
    schemaIncludeList: [],
    collectionIncludeList: [],
    createdAt: "",
    updatedAt: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isConfigModalOpen, setConfigModalOpen] = useState(false);
  const [isSchemaModalOpen, setSchemaModalOpen] = useState(false);
  const [isConnectionChecked, setIsConnectionChecked] = useState(false);
  const [isPreviewDataModalOpen, setPreviewDataModalOpen] = useState(false);
  const [isTableConfigModalOpen, setTableConfigModalOpen] = useState(false);

  const navigate = useNavigate();

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const checkConnectionMutation = useCheckConnection();
  const getSchemaMutation = useGetSchema();
  const previewDataMutation = usePreviewData();
  const submitConfigMutation = useSubmitConfig();
  const submitTableMutation = useSubmitTableConfig();

  const handleLoginClick = () => {
    handleSignIn({ username, password });
  };

  const handleSignIn = async (signinData: SigninData) => {
    try {
      loginMutation.mutate(signinData, {
        onSuccess: (response) => {
          console.log(response);
          if (signinData.username === "admin@authstream.com") {
            setRegisterModalOpen(true);
          } else {
            toast.success("Sign-in successful!");
            localStorage.setItem(JWT_LOCAL_STORAGE_KEY, response.id);
            navigate("/");
          }
        },
        onError: () => {
          toast.error("Failed to Sign in");
        },
      });
    } catch (error) {
      toast.error("Failed to Signin");
    }
  };

  const handleSignInAfterRegister = async (signinData: SigninData) => {
    try {
      loginMutation.mutate(signinData, {
        onSuccess: (response) => {
          if (signinData.username === "admin@authstream.com") {
            setRegisterModalOpen(true);
          } else {
            toast.success("Sign-in successful!");
            localStorage.setItem(JWT_LOCAL_STORAGE_KEY, response.id);
            navigate("/");
          }
        },
        onError: () => {
          toast.error("Failed to Sign in");
        },
      });
    } catch (error) {
      toast.error("Failed to Signin");
    }
  };

  const handleRegister = async (registerData: RegisterData) => {
    try {
      registerMutation.mutate(registerData, {
        onSuccess: (response) => {
          toast.success("Registration successful, logging in...");
          setUserData({
            username: registerData.username,
            password: registerData.password,
            id: response.id,
          });
          setRegisterModalOpen(false);
          setConfigModalOpen(true);
          setIsConnectionChecked(false);
        },
        onError: () => {
          toast.error("Failed to Register");
        },
      });
    } catch (error) {
      toast.error("Failed to register");
    }
  };

  const handleGetSchema = async (dbConfig: DbConfig) => {
    try {
      getSchemaMutation.mutate(
        {
          ...dbConfig,
          username: userData.username,
          password: userData.password,
        },
        {
          onSuccess: (response) => {
            toast.success("Saved Config");
            setSchema(response);
            setSchemaModalOpen(true);
            setConfigModalOpen(false);
            setConfig({
              ...dbConfig,
              username: userData.username,
              password: userData.password,
            });
          },
          onError: () => {
            toast.error("Cannot Save");
          },
        }
      );

    } catch (error) {
      toast.error("Error fetching schema");
    }
  };

  const handleCheckConnection = async (dbConfig: DbConfig) => {
    try {
      checkConnectionMutation.mutate(
        {
          ...dbConfig,
          username: userData.username,
          password: userData.password,
        },
        {
          onSuccess: (response) => {
            toast.success(response);
            setIsConnectionChecked(true);
          },
          onError: (error: Error) => {
            // toast.error(error.message);
            if ((error as AxiosError).isAxiosError) {
              const axiosError = error as AxiosError;
              if (axiosError.response && axiosError.response.data) {
                const errorMessage =
                  typeof axiosError.response.data === "string"
                    ? axiosError.response.data
                    : JSON.stringify(axiosError.response.data);
                toast.error(errorMessage);
              } else {
                toast.error("An unexpected error occurred");
              }
            } else {
              toast.error(error.message || "An unexpected error occurred");
            }
            setIsConnectionChecked(false);
          },
        }
      );
    } catch (error) {
      toast.error("Error checking connection");
      setIsConnectionChecked(false);
    }
  };

  const handlePreviewTable = async (data: tableSchema[]) => {
    try {

      const connStr = getConnectionString();
      console.log("vaicaloon connStr: " + connStr);
      
   
      previewDataMutation.mutate(
        { tables: data, connectionString: connStr},
        {
          onSuccess: (response) => {
            setConfig({
              ...config,
              tableIncludeList: data,
            });
            setPreviewData(response);
            setPreviewDataModalOpen(true);
            setSchemaModalOpen(false);
          },
          onError: (error: Error) => {
            toast.error("Failed to preview table");
            console.error(error);
          },
        }
      );
    } catch (error) {
      toast.error("Error previewing table");
      throw error;
    }
  };

  const handleSubmitConfig = async () => {
    // setPreviewDataModalOpen(false);
    // setTableConfigModalOpen(true);
    const connStr = getConnectionString();
    console.log("vaicaloon connStr: " + connStr);

    setConfig(
      {...config, connectionString: connStr }
    )
    const updatedConfig = { ...config, connectionString: connStr };

    console.log("sjt htmWJK", config);
    
    try {
      submitConfigMutation.mutate(updatedConfig, {
        onSuccess: () => {
          toast.success("Configuration submitted successfully!");
          setPreviewDataModalOpen(false);
          setTableConfigModalOpen(true);
        },
        onError: (error: Error) => {
          toast.error("Failed to submit configuration");
          console.error(error);
        },
      });
    } catch (error) {
      toast.error("An unexpected error occurred");
      throw error;
    }
  };

  const handleTableConfigSubmit = async (tableConfig: TableConfig) => {
    try {
      submitTableMutation.mutate(tableConfig, {
        onSuccess: () => {
          toast.success("Table configuration submitted successfully!");
          setTableConfigModalOpen(false);
          handleSignInAfterRegister({
            username: userData.username,
            password: userData.password,
          });
        },
        onError: (error: Error) => {
          toast.error("Failed to submit table configuration");
          console.error(error);
        },
      });
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    }
  };

  const isLoading =
    loginMutation.isPending ||
    registerMutation.isPending ||
    checkConnectionMutation.isPending ||
    getSchemaMutation.isPending ||
    previewDataMutation.isPending ||
    submitConfigMutation.isPending ||
    submitTableMutation.isPending;

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <LoadingBar isLoading={isLoading} />
      </div>
      <div className="text-foreground min-h-screen flex flex-col items-center justify-center">
        <div className="absolute top-0 left-0 w-full">
          <LoadingBar isLoading={loginMutation.isPending} />
        </div>
        <div className="bg-white dark:bg-gray-800 border-black border-2 p-8 rounded-lg shadow-lg w-96 sketch-border">
          <h2 className="text-4xl font-bold text-center mb-2">AUTHSTREAM</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            Welcome, AuthStream
          </p>
          <div className="mb-4">
            <Input
              type="text"
              className="w-full p-2 border rounded border-black shadow-sm"
              value={username}
              placeholder="Username"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 relative">
            <Input
              type={showPassword ? "text" : "password"}
              className="w-full p-2 border rounded border-black shadow-sm"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500 p-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <Button
            onClick={handleLoginClick}
            className="w-full bg-blue-500 text-black py-2 hover:bg-blue-600 border-2"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Logging in..." : "Log in"}
          </Button>
        </div>

        {/* Modals with Internal Loading */}
        {isRegisterModalOpen && (
          <RegisterModal
            onRegister={handleRegister}
            onClose={() => setRegisterModalOpen(false)}
            loading={registerMutation.isPending}
          />
        )}

        {isConfigModalOpen && (
          <ConfigDBModal
            onCreate={handleGetSchema}
            onCheck={handleCheckConnection}
            onClose={() => {
              setConfigModalOpen(false);
              setIsConnectionChecked(false);
            }}
            isConnectionChecked={isConnectionChecked}
            loading={
              checkConnectionMutation.isPending || getSchemaMutation.isPending
            }
          />
        )}

        {isSchemaModalOpen && (
          <ViewSchemaModal
            schema={schema}
            onSubmit={handlePreviewTable}
            onClose={() => setSchemaModalOpen(false)}
            loading={previewDataMutation.isPending}
          />
        )}

        {isPreviewDataModalOpen && (
          <PreviewDataModal
            previewData={previewData}
            onSubmit={handleSubmitConfig}
            onClose={() => setPreviewDataModalOpen(false)}
            loading={submitConfigMutation.isPending}
          />
        )}

        {isTableConfigModalOpen && (
          <TableConfigModal
            isOpen={isTableConfigModalOpen}
            onClose={() => setTableConfigModalOpen(false)}
            onSubmit={handleTableConfigSubmit}
            tableSchemas={config.tableIncludeList}
            loading={submitTableMutation.isPending}
          />
        )}
      </div>
    </>
  );
};

export default SignIn;
