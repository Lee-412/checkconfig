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
import { HashConfig, TableConfig, tableSchema } from "../../api/type";
import { z } from "zod";

// Define Zod schemas for validation
const argon2ConfigSchema = z.object({
  iterations: z.number().positive(),
  memory: z.number().positive(),
  parallelism: z.number().positive(),
  salt: z.string().min(8, "Salt must be at least 8 characters long"),
});

const bcryptConfigSchema = z.object({
  workFactor: z.number().positive(),
  salt: z.string().min(8, "Salt must be at least 8 characters long"),
});

const pbkdf2ConfigSchema = z.object({
  iterations: z.number().positive(),
  keyLength: z.number().positive(),
  salt: z.string().min(8, "Salt must be at least 8 characters long"),
});

const scryptConfigSchema = z.object({
  n: z.number().positive(),
  r: z.number().positive(),
  p: z.number().positive(),
  keyLength: z.number().positive(),
  salt: z.string().min(8, "Salt must be at least 8 characters long"),
});

const shaConfigSchema = z.object({
  salt: z.string().min(8, "Salt must be at least 8 characters long"),
});

const tableConfigSchema = z.object({
  userTable: z.string().min(1, "Table is required"),
  usernameAttribute: z.string().min(1, "Username attribute is required"),
  passwordAttribute: z.string().min(1, "Password attribute is required"),
  hashingType: z.string().min(1, "Hashing type is required"),
  salt: z.string().min(8, "Salt must be at least 8 characters long"),
  hashConfig: z.union([
    argon2ConfigSchema,
    bcryptConfigSchema,
    pbkdf2ConfigSchema,
    scryptConfigSchema,
    shaConfigSchema,
  ]),
});

interface TableConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (config: TableConfig) => void;
  tableSchemas: tableSchema[];
  loading: boolean;
}

const TableConfigModal = ({
  isOpen,
  onClose,
  onSubmit,
  tableSchemas,
  loading,
}: TableConfigModalProps) => {
  const [userTable, setUserTable] = useState("");
  const [usernameAttribute, setUsernameAttribute] = useState("");
  const [passwordAttribute, setPasswordAttribute] = useState("");
  const [hashingType, setHashingType] = useState("");
  const [salt, setSalt] = useState("");
  const [argon2Config, setArgon2Config] = useState({
    iterations: 0,
    memory: 0,
    parallelism: 0,
  });
  const [bcryptConfig, setBcryptConfig] = useState({ workFactor: 0 });
  const [pbkdf2Config, setPbkdf2Config] = useState({
    iterations: 0,
    keyLength: 0,
  });
  const [scryptConfig, setScryptConfig] = useState({
    n: 0,
    r: 0,
    p: 0,
    keyLength: 0,
  });

  const hashingTypes = [
    "BCRYPT",
    "ARGON2",
    "PBKDF2",
    "SHA256",
    "SHA512",
    "SCRYPT",
  ];
  const selectedTableFields =
    tableSchemas.find((t) => t.tableName === userTable)?.columns || [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "userTable":
        setUserTable(value);
        setUsernameAttribute("");
        setPasswordAttribute("");
        break;
      case "usernameAttribute":
        setUsernameAttribute(value);
        break;
      case "passwordAttribute":
        setPasswordAttribute(value);
        break;
      case "hashingType":
        setHashingType(value);
        break;
      case "salt":
        setSalt(value);
        break;
      case "argon2Iterations":
        setArgon2Config((prev) => ({ ...prev, iterations: Number(value) }));
        break;
      case "argon2Memory":
        setArgon2Config((prev) => ({ ...prev, memory: Number(value) }));
        break;
      case "argon2Parallelism":
        setArgon2Config((prev) => ({ ...prev, parallelism: Number(value) }));
        break;
      case "bcryptWorkFactor":
        setBcryptConfig((prev) => ({ ...prev, workFactor: Number(value) }));
        break;
      case "pbkdf2Iterations":
        setPbkdf2Config((prev) => ({ ...prev, iterations: Number(value) }));
        break;
      case "pbkdf2KeyLength":
        setPbkdf2Config((prev) => ({ ...prev, keyLength: Number(value) }));
        break;
      case "scryptN":
        setScryptConfig((prev) => ({ ...prev, n: Number(value) }));
        break;
      case "scryptR":
        setScryptConfig((prev) => ({ ...prev, r: Number(value) }));
        break;
      case "scryptP":
        setScryptConfig((prev) => ({ ...prev, p: Number(value) }));
        break;
      case "scryptKeyLength":
        setScryptConfig((prev) => ({ ...prev, keyLength: Number(value) }));
        break;
      default:
        break;
    }
  };

  const resetForm = () => {
    setUserTable("");
    setUsernameAttribute("");
    setPasswordAttribute("");
    setHashingType("");
    setSalt("");
    setArgon2Config({ iterations: 0, memory: 0, parallelism: 0 });
    setBcryptConfig({ workFactor: 0 });
    setPbkdf2Config({ iterations: 0, keyLength: 0 });
    setScryptConfig({ n: 0, r: 0, p: 0, keyLength: 0 });
  };

  const handleSubmit = () => {
    try {
      let hashConfig: HashConfig;

      switch (hashingType) {
        case "ARGON2":
          hashConfig = { ...argon2Config, salt };
          argon2ConfigSchema.parse(hashConfig);
          break;
        case "BCRYPT":
          hashConfig = { ...bcryptConfig, salt };
          bcryptConfigSchema.parse(hashConfig);
          break;
        case "PBKDF2":
          hashConfig = { ...pbkdf2Config, salt };
          pbkdf2ConfigSchema.parse(hashConfig);
          break;
        case "SCRYPT":
          hashConfig = { ...scryptConfig, salt };
          scryptConfigSchema.parse(hashConfig);
          break;
        case "SHA256":
        case "SHA512":
          hashConfig = { salt };
          shaConfigSchema.parse(hashConfig);
          break;
        default:
          throw new Error("Invalid hashing type");
      }

      const config: TableConfig = {
        userTable,
        usernameAttribute,
        passwordAttribute,
        hashingType,
        salt,
        hashConfig,
      };

      tableConfigSchema.parse(config);

      onSubmit(config);
      resetForm();
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message).join(", ");
        toast.warning(errorMessages);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Table</DialogTitle>
          <DialogDescription>
            Set up the table and hashing settings for user authentication.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="_employee_ block text-sm font-medium text-gray-700 mb-1">
              User Table
            </label>
            <select
              name="userTable"
              value={userTable}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-600 text-sm"
            >
              <option value="">Choose a table containing user data</option>
              {tableSchemas.map((t) => (
                <option key={t.tableName} value={t.tableName}>
                  {t.tableName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username Attribute
            </label>
            <select
              name="usernameAttribute"
              value={usernameAttribute}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-600 text-sm"
              disabled={!userTable}
            >
              <option value="">
                Select the column for usernames (e.g., email)
              </option>
              {selectedTableFields.map((col) => (
                <option key={col.name} value={col.name}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Attribute
            </label>
            <select
              name="passwordAttribute"
              value={passwordAttribute}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-600 text-sm"
              disabled={!userTable}
            >
              <option value="">Select the column for hashed passwords</option>
              {selectedTableFields.map((col) => (
                <option key={col.name} value={col.name}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hashing Type
            </label>
            <select
              name="hashingType"
              value={hashingType}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-600 text-sm"
            >
              <option value="">Choose a hashing algorithm</option>
              {hashingTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salt
            </label>
            <Input
              name="salt"
              value={salt}
              onChange={handleChange}
              placeholder="Enter a salt value for hashing"
            />
            <p className="text-xs text-gray-500 mt-1">
              A unique value to make hashes more secure
            </p>
          </div>

          {hashingType === "ARGON2" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Iterations
                </label>
                <Input
                  name="argon2Iterations"
                  type="number"
                  value={argon2Config.iterations}
                  onChange={handleChange}
                  placeholder="Enter number of iterations (e.g., 3)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Number of passes over the data (higher = slower, more secure)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Memory (KB)
                </label>
                <Input
                  name="argon2Memory"
                  type="number"
                  value={argon2Config.memory}
                  onChange={handleChange}
                  placeholder="Enter memory usage in KB (e.g., 65536)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Memory cost in kilobytes
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parallelism
                </label>
                <Input
                  name="argon2Parallelism"
                  type="number"
                  value={argon2Config.parallelism}
                  onChange={handleChange}
                  placeholder="Enter parallelism factor (e.g., 1)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Number of parallel threads
                </p>
              </div>
            </>
          )}
          {hashingType === "BCRYPT" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Factor
              </label>
              <Input
                name="bcryptWorkFactor"
                type="number"
                value={bcryptConfig.workFactor.toString()} // Convert to string for input
                onChange={handleChange}
                placeholder="Enter work factor (e.g., 12)"
                min={1} // Enforce positive numbers
                step={1} // Ensure whole numbers only
              />
              <p className="text-xs text-gray-500 mt-1">
                Controls hashing time (higher = slower, more secure)
              </p>
            </div>
          )}
          {hashingType === "PBKDF2" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Iterations
                </label>
                <Input
                  name="pbkdf2Iterations"
                  type="number"
                  value={pbkdf2Config.iterations}
                  onChange={handleChange}
                  placeholder="Enter number of iterations (e.g., 10000)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Number of hashing rounds
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Length
                </label>
                <Input
                  name="pbkdf2KeyLength"
                  type="number"
                  value={pbkdf2Config.keyLength}
                  onChange={handleChange}
                  placeholder="Enter key length in bytes (e.g., 32)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Length of the derived key
                </p>
              </div>
            </>
          )}
          {hashingType === "SCRYPT" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  N (CPU/Memory Cost)
                </label>
                <Input
                  name="scryptN"
                  type="number"
                  value={scryptConfig.n}
                  onChange={handleChange}
                  placeholder="Enter CPU/memory cost (e.g., 16384)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  General work factor (must be a power of 2)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  R (Block Size)
                </label>
                <Input
                  name="scryptR"
                  type="number"
                  value={scryptConfig.r}
                  onChange={handleChange}
                  placeholder="Enter block size (e.g., 8)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Size of memory blocks
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  P (Parallelization)
                </label>
                <Input
                  name="scryptP"
                  type="number"
                  value={scryptConfig.p}
                  onChange={handleChange}
                  placeholder="Enter parallelization factor (e.g., 1)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Number of parallel threads
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Length
                </label>
                <Input
                  name="scryptKeyLength"
                  type="number"
                  value={scryptConfig.keyLength}
                  onChange={handleChange}
                  placeholder="Enter key length in bytes (e.g., 32)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Length of the derived key
                </p>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TableConfigModal;
