import { FC } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ProductFilterProps } from "./products-types";
import { useTranslation } from "react-i18next";

const ProductFilter: FC<ProductFilterProps> = ({
  isFilterOpen,
  setIsFilterOpen,
  dateRange,
  setDateRange,
  priceRange,
  setPriceRange,
}: ProductFilterProps) => {
  
  const defaultDateRange = { from: undefined, to: undefined };
  const defaultPriceRange = { min: 0, max: 1000 };
  const { t } = useTranslation('categoriesAndProducts')

  const handleClearFilters = () => {
    setDateRange(defaultDateRange);  // Reset date range
    setPriceRange(defaultPriceRange);  // Reset price range
  };

  return (
    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> {t('products.filter.filter')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{t('products.filter.dateRange')}</h4>
            <div className="flex gap-2">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  const newRange = {
                    from: range?.from ?? undefined,
                    to: range?.to ?? undefined,
                  };
                  setDateRange(newRange);
                }}
                className="rounded-md border"
              />
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{t('products.filter.priceRange')}</h4>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleClearFilters}>
            {t('products.filter.clear')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProductFilter;
