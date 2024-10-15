import { FC } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface ProductFilterProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;
}

const ProductFilter : FC<ProductFilterProps> = ({
  isFilterOpen,
  setIsFilterOpen,
  dateRange,
  setDateRange,
  priceRange,
  setPriceRange,
}: ProductFilterProps) => {
  return (
    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Date Range</h4>
            <div className="flex gap-2">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  const newRange = {
                    from: range?.from ?? undefined, // ensure 'from' is either a Date or undefined
                    to: range?.to ?? undefined,     // ensure 'to' is either a Date or undefined
                  };
                  setDateRange(newRange);            // safely update the date range
                }}
                className="rounded-md border"
              />
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Price Range</h4>
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
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ProductFilter
