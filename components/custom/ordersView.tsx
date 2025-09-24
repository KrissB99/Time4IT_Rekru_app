"use client";

import { useEffect, useState } from "react";

// Shadcn UI components
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, MoreVertical, Trash } from "lucide-react";

// Custom components
import StatusBadge from "./statusBadge";
import { Paggination } from "./paggination";
import RemoveAlert from "./removeDialog";

// Internal types & helpers
import { Order } from "@/lib/orders-types";
import { formatDate } from "@/lib/helpers";
import { AddOrderDialog } from "./addOrderModal";

export function OrdersView() {
  const [loading, setLoading] = useState(true);

  // Data
  const [orders, setOrders] = useState<Order[]>([]);
  const [allElementsFound, setAllElementsFound] = useState(0);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [elementsPerPage, setElementsPerPage] = useState<number>(7);
  const [totalPages, setTotalPages] = useState(1);

  // Filters and sorting
  const [visibleColumns, setVisibleColumns] = useState<
    Record<
      string,
      {
        isVisible: boolean;
        label: string;
      }
    >
  >({
    orderNumber: { isVisible: true, label: "Numer zamówienia" },
    dueDate: { isVisible: true, label: "Data" },
    status: { isVisible: true, label: "Status" },
    totalGross: { isVisible: true, label: "Kwota" },
    customer: { isVisible: true, label: "Kient" },
  });

  // Remove dialog show
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [orderToDeleteId, setOrderToDeleteId] = useState<string | null>(null);

  // Adding New Order
  const [showAddModal, setShowAddModal] = useState(false);

  function formatToUSD(amount: number) {
    // TO DO - find api to exchange rates
    // For now, we will use a fixed conversion rate of 1 USD = 0.27 PLN
    return (amount * 0.27).toFixed(2);
  }

  async function fetchOrders() {
    setLoading(true);
    const res = await fetch(
      `/api/orders?page=${currentPage}&perPage=${elementsPerPage}`
    );
    const data = await res.json();
    setOrders(data.items);
    setTotalPages(data.totalPages);
    setAllElementsFound(data.total);
    setLoading(false);
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
                  {allElementsFound}
                </div>
                <div className="text-sm text-gray-500">Wszystkich zamówień</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Konfiguruj widok
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {Object.entries(visibleColumns).map(([column, colObj]) => (
                    <DropdownMenuItem key={column}>
                      <Checkbox
                        id={column}
                        checked={colObj.isVisible}
                        onCheckedChange={() =>
                          setVisibleColumns((prev) => ({
                            ...prev,
                            [column]: {
                              ...prev[column],
                              isVisible: !prev[column].isVisible,
                            },
                          }))
                        }
                      />
                      {colObj.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Add order button */}
              <AddOrderDialog
                isOpen={showAddModal}
                setIsOpen={setShowAddModal}
                onOrderAdded={fetchOrders}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedOrders.length === orders.length &&
                        orders.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all orders"
                    />
                  </TableHead>
                  {Object.entries(visibleColumns).map(
                    ([column, colObj]) =>
                      colObj.isVisible && (
                        <TableHead key={column}>
                          <div className="flex items-center gap-3">
                            {colObj.label}
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                      )
                  )}
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <TableCell className="w-12">
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => handleSelectOrder(order.id)}
                        aria-label={`Select order ${order.orderNumber}`}
                      />
                    </TableCell>
                    {visibleColumns.orderNumber.isVisible && (
                      <TableCell>
                        <div className="flex items-center gap-3 min-w-[400px]">
                          <span className="text-sm font-normal text-gray-900">
                            {order.orderNumber}
                          </span>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.dueDate.isVisible && (
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(order.dueDate)}
                      </TableCell>
                    )}
                    {visibleColumns.status.isVisible && (
                      <TableCell className="text-sm">
                        <StatusBadge status={order.status} />
                      </TableCell>
                    )}
                    {visibleColumns.totalGross.isVisible && (
                      <TableCell className="text-sm text-gray-900">
                        ${formatToUSD(order.totalGross)}
                      </TableCell>
                    )}
                    {visibleColumns.customer.isVisible && (
                      <TableCell className="text-sm text-gray-600">
                        {order.customer}
                      </TableCell>
                    )}
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
