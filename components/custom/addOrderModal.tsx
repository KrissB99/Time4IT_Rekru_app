"use client";

import type React from "react";

import { useState } from "react";
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
import { Plus, X } from "lucide-react";

interface OrderFormData {
  clientName: string;
  orderNumber: string;
  status: string;
  amount: string;
}

interface AddOrderDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AddOrderDialog({ isOpen, setIsOpen }: AddOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    clientName: "",
    orderNumber: "",
    status: "Nowe",
    amount: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order data:", formData);
    // Here you would typically send the data to your API
    setOpen(false);
    // Reset form
    setFormData({
      clientName: "",
      orderNumber: "",
      status: "Nowe",
      amount: "",
    });
  };

  const handleCancel = () => {
    setOpen(false);
    // Reset form
    setFormData({
      clientName: "",
      orderNumber: "",
      status: "Nowe",
      amount: "",
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
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
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
                htmlFor="clientName"
                className="text-sm font-medium text-gray-700"
              >
                Nazwa klienta
              </Label>
              <Input
                id="clientName"
                placeholder="Podaj nazwę klienta"
                value={formData.clientName}
                onChange={(e) =>
                  setFormData({ ...formData, clientName: e.target.value })
                }
                className="w-full"
                required
              />
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
                  placeholder="Podaj Numer zamówienia"
                  value={formData.orderNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, orderNumber: e.target.value })
                  }
                  required
                />
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
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nowe">Nowe</SelectItem>
                    <SelectItem value="W trakcie">W trakcie</SelectItem>
                    <SelectItem value="Zakończone">Zakończone</SelectItem>
                    <SelectItem value="Anulowane">Anulowane</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="amount"
                className="text-sm font-medium text-gray-700"
              >
                Kwota
              </Label>
              <Input
                id="amount"
                placeholder="Podaj kwotę brutto zamówienia"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                type="number"
                step="0.01"
                min="0"
                required
              />
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
