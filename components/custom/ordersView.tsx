"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, MoreVertical, Plus, Trash, Trash2 } from "lucide-react";

import { Order } from "@/lib/orders-types";
import StatusBadge from "./statusBadge";
import { formatDate } from "@/lib/helpers";
import { Paggination } from "./paggination";
import { toast } from "sonner";
import RemoveAlert from "./removeDialog";

export function OrdersView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Remove dialog show
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [orderToDeleteId, setOrderToDeleteId] = useState<string | null>(null);

  // Adding New Order
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    orderNumber: "",
    customer: "",
    status: "pending",
    dueDate: "",
    totalGross: 0,
  });

  async function fetchOrders() {
    setLoading(true);
    const res = await fetch(`/api/orders?page=${currentPage}&perPage=7`);
    const data = await res.json();
    setOrders(data.items);
    setTotalPages(data.totalPages);
    setLoading(false);
  }

  async function addOrder() {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowAddModal(false);
      setForm({
        orderNumber: "",
        customer: "",
        status: "new",
        dueDate: "",
        totalGross: 0,
      });
      fetchOrders();
      toast.success("Zamówienie dodane!");
    } else {
      toast.error("Błąd dodawania zamówienia.");
    }
  }

  async function deleteOrder() {
    setLoading(true);
    if (!orderToDeleteId) return;
    const res = await fetch(`/api/orders/${orderToDeleteId}`, {
      method: "DELETE",
    });
    console.log(res);
    if (res.ok) {
      toast.error("Pomyślnie usunięto zamówienie.");
      fetchOrders();
    } else {
      toast.error("Coś poszło nie tak. Spróbuj ponownie później.");
    }
    setLoading(false);
    setIsRemoveDialogOpen(false);
    setOrderToDeleteId(null);
  }

  const openRemoveDialog = (orderId: string) => {
    setOrderToDeleteId(orderId);
    setIsRemoveDialogOpen(true);
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((order) => order.id));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <RemoveAlert
        deleteDialogOpen={isRemoveDialogOpen}
        setDeleteDialogOpen={setIsRemoveDialogOpen}
        action={deleteOrder}
      />
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Zamówienia</h2>
              <div className="mt-2">
                <div className="text-3xl font-bold text-gray-900">
                  {orders.length}
                </div>
                <div className="text-sm text-gray-500">Wszystkich zamówień</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    Konfiguruj widok
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Pokaż wszystkie kolumny</DropdownMenuItem>
                  <DropdownMenuItem>Ukryj status</DropdownMenuItem>
                  <DropdownMenuItem>Ukryj kwotę</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4" />
                Dodaj Zamówienie
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        //   checked={selectedOrders.length}
                        onCheckedChange={handleSelectAll}
                      />
                      Numer zamówienia
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                    <div className="flex items-center gap-1">
                      Data
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                    <div className="flex items-center gap-1">
                      Kwota
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                    Klient
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3 min-w-[400px]">
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={() => handleSelectOrder(order.id)}
                        />
                        <span className="text-sm font-normal text-gray-900">
                          {order.orderNumber}
                        </span>
                      </div>
                      {selectedOrders.includes(order.id) &&
                        order.id === "1" && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                            <Trash2 className="h-4 w-4" />
                            Usuń zamówienie
                          </div>
                        )}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {formatDate(order.dueDate)}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      ${order.totalGross.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {order.customer}
                    </td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-sm">
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => openRemoveDialog(order.id)}
                            >
                              <Trash className="text-red-500" />
                              Usuń zamówienie
                            </Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Paggination
            currentPage={currentPage}
            setCurrentPageAction={setCurrentPage}
            totalPages={totalPages}
          />
        </CardContent>
      </Card>
    </>
  );
}
