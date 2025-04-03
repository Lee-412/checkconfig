import { toast } from "react-toastify";


export const formatId = (id: string) => {
  if (!id || id.length < 4) return id; // Check an toàn
  return `${id.slice(0, 2)}...${id.slice(-2)}`;
};

  export const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Copied ID to clipboard!");
  };