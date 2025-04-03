

// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
// import { Button } from "./ui/button";
// import { LucideMessageCircleWarning } from "lucide-react";
// interface DeleteConfirmProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onConfirm: (id: string) => void;
//     providerId: string | null;
//     type: string;
// }

// const DeleteConfirm = ({ isOpen, onClose, onConfirm, providerId, type }: DeleteConfirmProps) => {
//     return (
//         <Dialog open={isOpen} onOpenChange={onClose}>
//             <DialogContent
//                 className="w-full sm:w-[400px] max-w-sm p-6 bg-white rounded-lg shadow-xl transform transition-all duration-300"
//             >
//                 <DialogHeader className="flex items-center space-x-3">
//                     {/* Thêm biểu tượng cảnh báo */}

//                     <div>
//                         <div className="flex gap-3">
//                             <DialogTitle className="text-2xl font-semibold text-gray-800">
//                                 Confirm Deletion
//                             </DialogTitle> <LucideMessageCircleWarning className="w-8 h-8 text-red-500" />
//                         </div>
//                         <DialogDescription className="text-gray-600 mt-2">
//                             Are you sure you want to delete this {type}? This action cannot be undone.
//                         </DialogDescription>
//                     </div>
//                 </DialogHeader>
//                 <DialogFooter className="flex justify-between gap-4 mt-4">
//                     <Button
//                         variant="outline"
//                         onClick={onClose}
//                         className="px-6 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200"
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
//                         onClick={() => {
//                             if (providerId) {
//                                 onConfirm(providerId);  // Truyền ID khi xác nhận
//                             }
//                             onClose();
//                         }}
//                     >
//                         Delete
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default DeleteConfirm;
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { LucideMessageCircleWarning } from "lucide-react";

interface DeleteConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (id: string) => void;
    providerId: string | null;
    type: string;
}

const DeleteConfirm = ({ isOpen, onClose, onConfirm, providerId, type }: DeleteConfirmProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="w-full sm:w-[400px] max-w-sm p-6 bg-white rounded-xl shadow-xl transform transition-all duration-500 ease-out scale-105"
            >
                <DialogHeader className="flex items-center space-x-3 mb-4">
                    {/* Biểu tượng cảnh báo với hiệu ứng chuyển động */}

                    <div className="flex flex-col">
                        <div className="flex gap-3 items-center">
                            <DialogTitle className="text-2xl font-semibold text-gray-800">
                                Confirm Deletion
                            </DialogTitle>
                            <LucideMessageCircleWarning className="w-12 h-12 text-red-600 animate-pulse" />
                        </div>
                        <DialogDescription className="text-gray-600 mt-2">
                            Are you sure you want to delete this {type}? This action cannot be undone.
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <DialogFooter className="flex justify-between gap-4 mt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 focus:ring-2 focus:ring-gray-400 transition-all duration-200 ease-in-out"
                    >
                        Cancel
                    </Button>
                    <Button
                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 transform active:scale-95"
                        onClick={() => {
                            if (providerId) {
                                onConfirm(providerId);
                            }
                            onClose();
                        }}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteConfirm;
