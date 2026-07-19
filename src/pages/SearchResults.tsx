import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePropertySearch } from "@/features/search/hooks/usePropertySearch";
import { SearchTopBar } from "@/features/search/components/SearchTopBar";
import { ResultsToolbar } from "@/features/search/components/ResultsToolbar";
import { AmenityFilterBar } from "@/features/search/components/AmenityFilterBar";
import { PropertyCard } from "@/features/search/components/PropertyCard";
import { SearchMapView } from "@/features/search/components/SearchMapView";
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

        <AmenityFilterBar
          selectedAmenities={search.filters.amenities}
          onToggleAmenity={search.toggleAmenity}
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            {search.isLoading ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-20 text-center">
                <Loader2 className="mb-3 size-8 animate-spin text-brand" />
                <p className="text-sm font-medium text-foreground">Loading hotels...</p>
              </div>
            ) : search.error ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-20 text-center">
                <p className="text-lg font-semibold text-foreground">Unable to load hotels</p>
                <p className="mt-2 text-sm text-muted-foreground">{search.error}</p>
                <Button
                  type="button"
                  className="mt-4"
                  onClick={() => search.reload()}
                >
                  Try again
                </Button>
              </div>
            ) : search.view === "card" ? (
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
              <SearchMapView
                properties={search.filteredProperties}
                searchParams={detailSearchParams}
                mode={search.query.mode}
                nights={search.nights}
                favorites={search.favorites}
                onToggleFavorite={search.toggleFavorite}
              />
            )}

            {!search.isLoading &&
              !search.error &&
              search.view === "card" &&
              search.totalResults > 0 && (
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
          />
        </div>
      </div>
    </div>
  );
}
