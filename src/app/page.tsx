import Header from "@/components/custom/header";
import { OrdersView } from "@/components/custom/ordersView";
import { formatDate } from "@/lib/helpers";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header name="Oliwia" date={formatDate(new Date().toDateString())} />
        <OrdersView />
      </div>
    </div>
  );
}
