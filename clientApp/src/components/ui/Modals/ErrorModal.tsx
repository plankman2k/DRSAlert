import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import {Button} from "../button";


interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    errorMessages: string[];
}

export function ErrorModal({ isOpen, onClose, errorMessages }: ErrorModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>Error</DialogTitle>
                <div className="text-red-500">
                    {errorMessages.map((msg, index) => (
                        <div key={index}>{msg}</div>
                    ))}
                </div>
                <Button onClick={onClose} className="mt-4 bg-red-600 hover:bg-red-700 text-white">
                    Close
                </Button>
            </DialogContent>
        </Dialog>
    );
}