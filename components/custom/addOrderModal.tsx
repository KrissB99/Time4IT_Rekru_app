"use client";

import { useState } from "react";

// Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Icons
import { Plus, X } from "lucide-react";

// Internal
import { OrderStatus } from "@/lib/orders-types";

interface AddOrderDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOrderAdded?: () => void;
}

interface formDataType {
  orderNumber: string;
  customer: string;
  status: OrderStatus | undefined;
  dueDate: string;
  totalGross: string;
}

export function AddOrderDialog({
  isOpen,
  setIsOpen,
  onOrderAdded,
}: AddOrderDialogProps) {
  const [formData, setFormData] = useState<formDataType>({
    orderNumber: "",
    customer: "",
    status: "new",
    dueDate: "",
    totalGross: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // clear previous errors

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber: formData.orderNumber,
        customer: formData.customer,
        status: formData.status,
        dueDate: formData.dueDate,
        totalGross: Number(formData.totalGross),
      }),
    });

    setLoading(false);

    if (res.ok) {
      setIsOpen(false);
      setFormData({
        orderNumber: "",
        customer: "",
        status: "new",
        dueDate: "",
        totalGross: "",
      });
      if (onOrderAdded) onOrderAdded();
      toast.success("Zamówienie zostało dodane.");
    } else if (res.status === 422) {
      const data = await res.json();
      // Map errors to fields
      const fieldErrors: Record<string, string> = {};
      data.fieldErrors.forEach((err: { field: string; message: string }) => {
        fieldErrors[err.field] = err.message;
      });
      setErrors(fieldErrors);
    } else {
      toast.error("Wystąpił błąd podczas dodawania zamówienia.");
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setFormData({
      orderNumber: "",
      customer: "",
      status: "new",
      dueDate: "",
      totalGross: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Dodaj Zamówienie
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0">
        <div className="relative">
          <button
            onClick={handleCancel}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <DialogHeader className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-gray-600" />
              </div>
              <DialogTitle className="text-xl font-semibold">
                Dodaj Zamówienie
              </DialogTitle>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="customer"
                className="text-sm font-medium text-gray-700"
              >
                Nazwa klienta
              </Label>
              <Input
                id="customer"
                placeholder="Podaj nazwę klienta"
                value={formData.customer}
                onChange={(e) =>
                  setFormData({ ...formData, customer: e.target.value })
                }
                aria-label="Nazwa klienta"
              />
              {errors.customer && (
                <div
                  className="text-xs text-red-600 mt-1"
                  role="alert"
                  aria-live="assertive"
                >
                  {errors.customer}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="orderNumber"
                  className="text-sm font-medium text-gray-700"
                >
                  Numer zamówienia
                </Label>
                <Input
                  id="orderNumber"
                  placeholder="Podaj numer zamówienia"
                  value={formData.orderNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, orderNumber: e.target.value })
                  }
                  aria-label="Numer zamówienia"
                />
                {errors.orderNumber && (
                  <div
                    className="text-xs text-red-600 mt-1"
                    role="alert"
                    aria-live="assertive"
                  >
                    {errors.orderNumber}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="status"
                  className="text-sm font-medium text-gray-700"
                >
                  Status zamówienia
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: OrderStatus) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Nowe</SelectItem>
                    <SelectItem value="processing">W trakcie</SelectItem>
                    <SelectItem value="shipped">Wysłane</SelectItem>
                    <SelectItem value="delivered">Zakończone</SelectItem>
                    <SelectItem value="cancelled">Anulowane</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="dueDate"
                className="text-sm font-medium text-gray-700"
              >
                Data realizacji
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => {
                  setFormData({ ...formData, dueDate: e.target.value });
                }}
              />
              {errors.dueDate && (
                <div
                  className="text-xs text-red-600 mt-1"
                  role="alert"
                  aria-live="assertive"
                >
                  {errors.dueDate}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="totalGross"
                className="text-sm font-medium text-gray-700"
              >
                Kwota (PLN)
              </Label>
              <Input
                id="totalGross"
                placeholder="Podaj kwotę brutto zamówienia"
                value={formData.totalGross}
                onChange={(e) =>
                  setFormData({ ...formData, totalGross: e.target.value })
                }
                type="number"
                step="0.01"
                min="0"
              />
              {errors.totalGross && (
                <div
                  className="text-xs text-red-600 mt-1"
                  role="alert"
                  aria-live="assertive"
                >
                  {errors.totalGross}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 bg-transparent"
              >
                Anuluj
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                disabled={loading}
              >
                Dodaj zamówienie
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
