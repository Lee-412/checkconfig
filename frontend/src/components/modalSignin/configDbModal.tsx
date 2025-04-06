import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { toast } from "react-toastify";
import { DbConfig } from "../../api/type";

interface ConfigDBModalProps {
  onCreate: (dbConfig: DbConfig) => void;
  onCheck: (dbConfig: DbConfig) => void;
  onClose: () => void;
  isConnectionChecked: boolean;
  loading: boolean; // Passed from parent, used locally
}

const ConfigDBModal = ({
  onCreate,
  onCheck,
  onClose,
  isConnectionChecked,
  loading,
}: ConfigDBModalProps) => {
  const [dbConfig, setDbConfig] = useState<DbConfig>({
    id: "",
    username: "",
    password: "",
    uri: "",
    host: "",
    databaseUsername: "",
    databasePassword: "",
    port: 0,
    connectionString: "",
    databaseType: "POSTGRESQL",
    sslMode: "DISABLE",
    tableIncludeList: [],
    schemaIncludeList: [],
    collectionIncludeList: [],
    createdAt: "",
    updatedAt: "",
  });

  const [, setErrors] = useState<Partial<Record<keyof DbConfig, string>>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const parseUri = (uri: string) => {
    try {
      const url = new URL(uri);
      const protocol = url.protocol.replace(":", "").toUpperCase();
      const hostname = url.hostname;
      const port = url.port ? parseInt(url.port) : 0;
      // const pathname = url.pathname.slice(1);
      const params = new URLSearchParams(url.search);
      const username = params.get("user") || "";
      const password = params.get("password") || "";
      const sslMode =
        params.get("sslmode")?.toUpperCase() === "REQUIRE"
          ? "REQUIRE"
          : "DISABLE";

      setDbConfig((prev) => ({
        ...prev,
        uri,
        host: hostname,
        databaseType:
          protocol === "POSTGRESQL" || protocol === "POSTGRES"
            ? "POSTGRESQL"
            : protocol === "MYSQL"
            ? "MYSQL"
            : protocol === "MONGODB"
            ? "MONGODB"
            : prev.databaseType,
        databaseUsername: username,
        databasePassword: password,
        port: port || prev.port,
        sslMode,
      }));
    } catch (error) {
      console.error("Invalid URI format:", error);
      toast.error("Invalid URI format. Please check the input.");
    }
  };

  const getConnectionStringPlaceholder = () => {
    const {
      host,
      databaseUsername,
      databasePassword,
      port,
      databaseType,
      sslMode,
    } = dbConfig;
    const dbName = dbConfig.uri.split("/")[3]?.split("?")[0] || "database";
    const portStr = port > 0 ? port : 5432;
    const sslModeStr = sslMode === "REQUIRE" ? "require" : "disable";
    const typePrefix =
      databaseType === "POSTGRESQL"
        ? "jdbc:postgresql"
        : databaseType === "MYSQL"
        ? "jdbc:mysql"
        : "mongodb";
    return `${typePrefix}://${
      host || "localhost"
    }:${portStr}/${dbName}?user=${databaseUsername}&password=${databasePassword}&sslmode=${sslModeStr}`;
  };

  const validateUri = (uri: string): string | null => {
    if (!uri) return "Database URI is required.";
    const uriRegex =
      /^(?:[a-zA-Z]+):\/\/(?:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+(?::\d+)?(?:\/[a-zA-Z0-9-]+)*(?:\?.*)?$/;
    if (!uriRegex.test(uri))
      return "Invalid URI format (e.g., postgresql://example.com:5432/db?user=admin&password=pass&sslmode=require)";
    return null;
  };

  const validateHost = (host: string): string | null => {
    if (!host) return "Host is required.";
    const hostRegex = /^(?:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+$/;
    if (!hostRegex.test(host))
      return "Invalid host format (e.g., localhost or example.com)";
    return null;
  };

  const validatePort = (port: number): string | null => {
    if (!port) return "Port is required.";
    if (isNaN(port) || port < 1 || port > 65535)
      return "Port must be a number between 1 and 65535.";
    return null;
  };

  const validateDatabaseType = (type: string): string | null => {
    const validTypes = ["POSTGRESQL", "MYSQL", "MONGODB"];
    if (!validTypes.includes(type)) return "Invalid database type.";
    return null;
  };

  const validateSslMode = (mode: string): string | null => {
    const validModes = ["DISABLE", "REQUIRE"];
    if (!validModes.includes(mode)) return "Invalid SSL mode.";
    return null;
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof DbConfig, string>> = {};

    const uriError = validateUri(dbConfig.uri);
    if (uriError) newErrors.uri = uriError;

    const hostError = validateHost(dbConfig.host);
    if (hostError) newErrors.host = hostError;

    const portError = validatePort(dbConfig.port);
    if (portError) newErrors.port = portError;

    const dbTypeError = validateDatabaseType(dbConfig.databaseType);
    if (dbTypeError) newErrors.databaseType = dbTypeError;

    const sslModeError = validateSslMode(dbConfig.sslMode);
    if (sslModeError) newErrors.sslMode = sslModeError;

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  useEffect(() => {
    validateForm();
  }, [dbConfig]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (loading) return; // Prevent changes when loading
    const { name, value } = e.target;
    const newValue = name === "port" ? parseInt(value) || 0 : value;
    setDbConfig((prev) => ({ ...prev, [name]: newValue }));
    if (name === "uri") {
      parseUri(value);
    }
  };

  const handleCheck = () => {
    if (!isFormValid) {
      toast.warning("Please fix the errors in the form.");
      return;
    }
    onCheck(dbConfig);
  };

  const handleSubmitConfig = () => {
    if (!isFormValid) {
      toast.warning("Please fix the errors in the form.");
      return;
    }
    onCreate(dbConfig);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure Database</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Input
              name="uri"
              value={dbConfig.uri}
              onChange={handleChange}
              placeholder="e.g: postgresql://example.com:5432/db?user=admin&password=pass&sslmode=require"
              disabled={loading}
            />
          </div>

          <div>
            <Input
              name="host"
              value={dbConfig.host}
              onChange={handleChange}
              placeholder="Host (e.g., localhost or example.com)"
              disabled={loading}
            />
          </div>

          <div>
            <Input
              name="databaseUsername"
              value={dbConfig.databaseUsername}
              onChange={handleChange}
              placeholder="Username"
              disabled={loading}
            />
          </div>

          <div>
            <Input
              name="databasePassword"
              type="password"
              value={dbConfig.databasePassword}
              onChange={handleChange}
              placeholder="Password"
              disabled={loading}
            />
          </div>

          <div>
            <Input
              name="port"
              type="number"
              value={dbConfig.port === 0 ? "" : dbConfig.port}
              onChange={handleChange}
              placeholder="Port"
              disabled={loading}
            />
          </div>

          {/* <div>
            <Input
              name="connectionString"
              value={dbConfig.connectionString}
              onChange={handleChange}
              placeholder={getConnectionStringPlaceholder()}
              disabled={loading}
            />
          </div> */}

          <div>
            <select
              name="databaseType"
              value={dbConfig.databaseType}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-600 text-sm"
              disabled={loading}
            >
              <option value="POSTGRESQL">PostgreSQL</option>
              <option value="MYSQL">MySQL</option>
              <option value="MONGODB">MongoDB</option>
            </select>
          </div>

          <div>
            <select
              name="sslMode"
              value={dbConfig.sslMode}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-600 text-sm"
              disabled={loading}
            >
              <option value="DISABLE">Disable</option>
              <option value="REQUIRE">Require</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="bg-green-500 text-white hover:bg-green-600"
            onClick={handleCheck}
            disabled={false || loading}
          >
            Check Connection
          </Button>
          <Button
            className="bg-green-500 text-white hover:bg-green-600"
            onClick={handleSubmitConfig}
            disabled={!isFormValid || !isConnectionChecked || loading}
          >
            View Schema
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigDBModal;
