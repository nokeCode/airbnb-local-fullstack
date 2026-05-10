'use client';

import { SearchHeader } from "@/components/client/SearchHeader";
import { FilterPanel } from "@/components/client/FilterPanel";
import { PropertyGrid } from "@/components/client/PropertyGrid";
import { defaultRentalFilters as defaultClientFilters } from "@/components/client/filters";
import { useState } from "react";

export default function ClientDashboard() {
  const [filters, setFilters] = useState(defaultClientFilters);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <SearchHeader filters={filters} onChange={setFilters} />
      
      <div className="flex">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(defaultClientFilters)}
        />
        <PropertyGrid filters={filters} />
      </div>
    </div>
  );
}
