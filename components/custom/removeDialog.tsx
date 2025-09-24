import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, X } from "lucide-react";

interface RemoveAlertProps {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  action: () => Promise<void>;
}

export default function RemoveAlert({
  deleteDialogOpen,
  setDeleteDialogOpen,
  action,
}: RemoveAlertProps) {
  return (
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-start space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <Trash2 className="h-5 w-5 text-red-600" />
          </div>
          <div className="text-start space-y-2">
            <DialogTitle className="text-lg font-semibold">
              Usuń Zamówienie
            </DialogTitle>
            <p className="text-sm text-gray-600">
              Czy jesteś pewny, że chcesz usunąć zamówienie?
            </p>
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(false)}
            className="flex-1 bg-transparent"
          >
            Anuluj
          </Button>
          <Button
            onClick={action}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            Usuń
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
