import { useLocation } from "wouter";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [_, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md" data-testid="form-search">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="input-search"
          className="flex-1"
        />
        <Button type="submit" size="icon" data-testid="button-search">
          <SearchIcon className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
