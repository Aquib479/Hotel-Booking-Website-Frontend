import { Map } from "lucide-react";
import { usePropertySearch } from "@/features/search/hooks/usePropertySearch";
import { SearchTopBar } from "@/features/search/components/SearchTopBar";
import { ResultsToolbar } from "@/features/search/components/ResultsToolbar";
import { CategoryFilterBar } from "@/features/search/components/CategoryFilterBar";
import { PropertyCard } from "@/features/search/components/PropertyCard";
import { FilterPanel } from "@/features/search/components/FilterPanel";
import { SearchPagination } from "@/features/search/components/SearchPagination";

export default function SearchResults() {
  const search = usePropertySearch();

  const detailSearchParams = new URLSearchParams({
    guests: search.query.guests,
    mode: search.query.mode,
    ...(search.query.mode === "stay"
      ? {
          ...(search.query.checkIn && { checkIn: search.query.checkIn.toISOString() }),
          ...(search.query.checkOut && { checkOut: search.query.checkOut.toISOString() }),
        }
      : {
          ...(search.query.restDate && { restDate: search.query.restDate.toISOString() }),
          ...(search.query.slot && { slot: search.query.slot }),
        }),
  }).toString();

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <SearchTopBar query={search.query} onSearch={search.setQuery} />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8">
        <ResultsToolbar
          location={search.query.location}
          totalResults={search.totalResults}
          mode={search.query.mode}
          sort={search.sort}
          view={search.view}
          onSortChange={search.setSort}
          onViewChange={search.setView}
        />

        <CategoryFilterBar
          activeCategory={search.filters.category}
          categoryCounts={search.categoryCounts}
          onCategoryChange={search.setCategory}
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            {search.view === "card" ? (
              search.paginatedProperties.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {search.paginatedProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      mode={search.query.mode}
                      nights={search.nights}
                      isFavorite={search.favorites.has(property.id)}
                      onToggleFavorite={search.toggleFavorite}
                      searchParams={detailSearchParams}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-20 text-center">
                  <p className="text-lg font-semibold text-foreground">No hotels found</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try adjusting your filters or search location.
                  </p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white py-24 text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-brand/10">
                  <Map className="size-8 text-brand" />
                </div>
                <p className="text-lg font-semibold text-foreground">Map View</p>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Showing {search.totalResults} hotels near {search.query.location}. Map
                  integration can be added here.
                </p>
              </div>
            )}

            {search.view === "card" && search.totalResults > 0 && (
              <SearchPagination
                page={search.page}
                totalPages={search.totalPages}
                perPage={search.perPage}
                onPageChange={search.setPage}
                onPerPageChange={search.setPerPage}
              />
            )}
          </div>

          <FilterPanel
            filters={search.filters}
            activeFilterCount={search.activeFilterCount}
            mode={search.query.mode}
            onUpdate={search.updateFilters}
            onClear={search.clearFilters}
            onToggleAmenity={search.toggleAmenity}
          />
        </div>
      </div>
    </div>
  );
}
