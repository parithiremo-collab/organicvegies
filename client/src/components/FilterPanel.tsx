import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { useLocation } from "wouter";

interface FilterPanelProps {
  onFiltersChange: (filters: {
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy?: string;
  }) => void;
}

export default function FilterPanel({ onFiltersChange }: FilterPanelProps) {
  const [_, navigate] = useLocation();
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [inStock, setInStock] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    params.set("minPrice", String(priceRange[0]));
    params.set("maxPrice", String(priceRange[1]));
    if (inStock) params.set("inStock", "true");
    params.set("sort", sortBy);
    navigate(`/shop?${params.toString()}`);
    onFiltersChange({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      inStock,
      sortBy,
    });
  };

  return (
    <Card className="p-5 space-y-5" data-testid="panel-filters">
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-3"
          data-testid="slider-price"
        />
        <div className="flex justify-between text-sm">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Stock Status</h3>
        <label className="flex items-center gap-2 cursor-pointer" data-testid="label-instock">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            data-testid="checkbox-instock"
          />
          <span className="text-sm">In Stock Only</span>
        </label>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-2 border rounded-md text-sm"
          data-testid="select-sort"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <Button
        onClick={handleApplyFilters}
        className="w-full"
        data-testid="button-apply-filters"
      >
        Apply Filters
      </Button>
    </Card>
  );
}
