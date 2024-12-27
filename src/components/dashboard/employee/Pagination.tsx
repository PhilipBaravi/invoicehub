import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
  totalItems: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
  rowsPerPage,
  totalItems,
}: PaginationProps) {
  const { t } = useTranslation('employees')
  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-sm text-muted-foreground">
    {t('pagination.showingEntries', {
        start: (currentPage - 1) * rowsPerPage + 1,
        end: Math.min(currentPage * rowsPerPage, totalItems),
        total: totalItems
    })}
</div>

      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          {t('pagination.previous')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          {t('pagination.next')}
        </Button>
      </div>
    </div>
  );
}
