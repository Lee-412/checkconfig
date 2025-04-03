import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";

interface LogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: {
    ip: string;
    user: string;
    event: string;
    created: string;
    context: object;
    rawEvent: object;
  };
}

const LogDetailModal = ({ isOpen, onClose, log }: LogDetailModalProps) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogTitle>Log Details</DialogTitle>
        <DialogDescription className="grid grid-cols-2 gap-4">
          {/* Event Info */}
          <div className="border p-4 rounded-md bg-gray-100 dark:bg-gray-800">
            <h3 className="font-bold mb-2">Event Info</h3>
            <p>
              <strong>IP:</strong> {log.ip}
            </p>
            <p>
              <strong>User:</strong> {log.user}
            </p>
            <p>
              <strong>Event:</strong> {log.event}
            </p>
            <p>
              <strong>Date Created:</strong> {log.created}
            </p>
          </div>

          {/* Context */}
          <div className="border p-4 rounded-md bg-gray-100 dark:bg-gray-800">
            <h3 className="font-bold mb-2">Context</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(log.context, null, 2)}
            </pre>
          </div>

          {/* Raw Event Info (Full Width) */}
          <div className="col-span-2 border p-4 rounded-md bg-gray-100 dark:bg-gray-800">
            <h3 className="font-bold mb-2">Raw Event Info</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(log.rawEvent, null, 2)}
            </pre>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default LogDetailModal;
