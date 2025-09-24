"use client";

import { Button } from "@/components/ui/button";

export function Paggination({
  currentPage,
  setCurrentPageAction,
  totalPages,
}: {
  currentPage: number;
  setCurrentPageAction: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}) {
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPageAction(currentPage - 1);
    }
  };
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPageAction(currentPage + 1);
    }
  };
  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
      <div className="text-sm text-gray-500">
        Strona {currentPage} z {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={previousPage}
        >
          Poprzednia
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={nextPage}
        >
          Następna
        </Button>
      </div>
    </div>
  );
}
