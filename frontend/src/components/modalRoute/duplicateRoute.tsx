import { Button } from "../ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Route } from "../../api/type";

interface DuplicateRouteProps {
  isOpen: boolean;
  onClose: () => void;
  duplicates: Route[];
  onReplace: (routes: Route[]) => void;
}

const DuplicateRoute = ({
  isOpen,
  onClose,
  duplicates,
  onReplace,
}: DuplicateRouteProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Duplicate Routes Found</DialogTitle>
        <DialogDescription>
          The following routes have duplicate names. Do you want to replace
          them?
        </DialogDescription>
        <ul>
          {duplicates.map((route) => (
            <li key={route.id} className="py-2 border-b">
              <strong>{route.name}</strong>
            </li>
          ))}
        </ul>
        <DialogFooter>
          <Button
            onClick={() => onReplace(duplicates)}
            className="bg-blue-500 text-white"
          >
            Replace
          </Button>
          <Button onClick={onClose} className="bg-gray-500 text-white">
            Skip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateRoute;
