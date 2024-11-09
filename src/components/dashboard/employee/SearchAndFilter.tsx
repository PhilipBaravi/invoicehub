import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Search } from 'lucide-react';
import { useTranslation } from "react-i18next";

interface SearchAndFilterProps<T> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategory: keyof T;
  setFilterCategory: (category: keyof T) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
  filterOptions: Array<{ value: keyof T; label: string }>;
}

export default function SearchAndFilter<T>({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  rowsPerPage,
  setRowsPerPage,
  filterOptions,
}: SearchAndFilterProps<T>) {
  const { t } = useTranslation('employees')
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Input
            id="searchTerm"
            name="searchTerm"
            type="text"
            placeholder={t('searchAndFilter.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-64"
            autoComplete="off"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <Select value={filterCategory as string} onValueChange={(value) => setFilterCategory(value as keyof T)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('searchAndFilter.filterBy')} />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.value as string} value={option.value as string}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t('searchAndFilter.rowsPerPage')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 {t('searchAndFilter.rows')}</SelectItem>
          <SelectItem value="20">20 {t('searchAndFilter.rows')}</SelectItem>
          <SelectItem value="50">50 {t('searchAndFilter.rows')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
