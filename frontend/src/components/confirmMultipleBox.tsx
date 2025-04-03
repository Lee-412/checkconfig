import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "../components/ui/dialog";

interface DeleteMultipleConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (selectedTokens: string[]) => void;
    selectedArray: string[];
    type: string;
}

const DeleteMultipleConfirm = ({ isOpen, onClose, onConfirm, selectedArray, type }: DeleteMultipleConfirmProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full sm:w-[400px] max-w-sm p-6 bg-white rounded-xl shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Confirm Deletion</DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Are you sure you want to delete the selected {selectedArray.length} {type}(s)? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        onClick={() => {
                            onConfirm(selectedArray); // Gọi hàm xóa khi xác nhận
                            onClose(); // Đóng hộp thoại
                        }}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteMultipleConfirm;
