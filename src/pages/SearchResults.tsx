import { useCallback, useEffect, useRef, useState } from "react";
import { Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { cn } from "@/lib/utils";
import { usePropertySearch } from "@/features/search/hooks/usePropertySearch";
import { SearchTopBar } from "@/features/search/components/SearchTopBar";
import { ResultsToolbar } from "@/features/search/components/ResultsToolbar";
import { PropertyCard } from "@/features/search/components/PropertyCard";
import { PropertyGridSkeleton } from "@/features/search/components/PropertyCardSkeleton";
import { SearchMapView } from "@/features/search/components/SearchMapView";
import { SearchFilterSidebar } from "@/features/search/components/SearchFilterSidebar";
import { INFINITE_SCROLL_PAGE_SIZE } from "@/features/search/constants";

export default function SearchResults() {
  const search = usePropertySearch();
  const [visibleCount, setVisibleCount] = useState(INFINITE_SCROLL_PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const resultsScrollRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  const detailSearchParams = new URLSearchParams({
    mode: search.query.mode,
    ...(search.query.guests ? { guests: search.query.guests } : {}),
    ...(search.query.mode === "stay"
      ? {
          ...(search.query.checkIn && {
            checkIn: search.query.checkIn.toISOString(),
          }),
          ...(search.query.checkOut && {
            checkOut: search.query.checkOut.toISOString(),
          }),
        }
      : {
          ...(search.query.restDate && {
            restDate: search.query.restDate.toISOString(),
          }),
          ...(search.query.slot && { slot: search.query.slot }),
        }),
  }).toString();

  // Reset window only when the search/filter context changes — not when
  // more hotels stream in from availability polling.
  useEffect(() => {
    setVisibleCount(INFINITE_SCROLL_PAGE_SIZE);
    setLoadingMore(false);
    resultsScrollRef.current?.scrollTo({ top: 0 });
    setHideNavbar(false);
    lastScrollTop.current = 0;
  }, [
    search.filters,
    search.nameQuery,
    search.sort,
    search.query.location,
    search.query.checkIn,
    search.query.checkOut,
    search.query.restDate,
    search.query.mode,
  ]);

  // Keep visible window valid as the loaded list grows (without resetting to page 1).
  useEffect(() => {
    setVisibleCount((count) => {
      if (search.loadedResults === 0) return INFINITE_SCROLL_PAGE_SIZE;
      return Math.min(
        Math.max(count, INFINITE_SCROLL_PAGE_SIZE),
        search.loadedResults,
      );
    });
  }, [search.loadedResults]);

  const visibleProperties = search.filteredProperties.slice(0, visibleCount);
  const hasMoreLoaded = visibleCount < search.loadedResults;
  const waitingForStream =
    search.isStreamingResults && visibleCount >= search.loadedResults;
  const hasMore = hasMoreLoaded || search.isStreamingResults;

  const loadMore = useCallback(() => {
    if (loadingMore) return;

    if (hasMoreLoaded) {
      setLoadingMore(true);
      window.setTimeout(() => {
        setVisibleCount((count) =>
          Math.min(count + INFINITE_SCROLL_PAGE_SIZE, search.loadedResults),
        );
        setLoadingMore(false);
      }, 280);
      return;
    }

    // At end of currently loaded hotels while suppliers are still streaming —
    // keep skeleton visible; new hotels append into the list below.
    if (waitingForStream) {
      setLoadingMore(true);
    }
  }, [
    hasMoreLoaded,
    loadingMore,
    search.loadedResults,
    waitingForStream,
  ]);

  // Clear "waiting for stream" skeleton once more hotels arrive or search ends.
  useEffect(() => {
    if (!search.isStreamingResults) {
      setLoadingMore(false);
      return;
    }
    if (search.loadedResults > visibleCount) {
      setLoadingMore(false);
    }
  }, [search.isStreamingResults, search.loadedResults, visibleCount]);

  useEffect(() => {
    const node = sentinelRef.current;
    const root = resultsScrollRef.current;
    if (!node || !root || search.view !== "card") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadMore();
        }
      },
      { root, rootMargin: "240px", threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, search.view, visibleProperties.length, hasMore]);

  // Scroll down → hide navbar; scroll up → show navbar. Search bar stays.
  useEffect(() => {
    const root = resultsScrollRef.current;
    if (!root) return;

    const onScroll = () => {
      const y = root.scrollTop;
      const delta = y - lastScrollTop.current;

      if (y <= 8) {
        setHideNavbar(false);
      } else if (delta > 6) {
        setHideNavbar(true);
      } else if (delta < -6) {
        setHideNavbar(false);
      }

      lastScrollTop.current = y;
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, []);

  const showTrailingSkeleton =
    loadingMore || waitingForStream || (search.isLoading && search.totalResults > 0);

  const skeletonCount = (() => {
    if (search.isLoading && search.loadedResults === 0) {
      return Math.min(9, Math.max(6, search.totalResults || 9));
    }
    const remaining =
      search.totalResults > search.loadedResults
        ? search.totalResults - Math.max(visibleCount, search.loadedResults)
        : 0;
    return Math.min(3, Math.max(remaining || 3, 3));
  })();

  const filterSidebar = (
    <SearchFilterSidebar
      filters={search.filters}
      activeFilterCount={search.activeFilterCount}
      mode={search.query.mode}
      locationLabel={search.query.location}
      onUpdate={search.updateFilters}
      onClear={search.clearFilters}
      onToggleAmenity={search.toggleAmenity}
    />
  );

  return (
    <div className="flex h-dvh flex-col bg-[#fafafa]">
      {/* Sticky chrome: collapsible navbar + persistent search */}
      <div className="sticky top-0 z-50 shrink-0 bg-white shadow-sm">
        <div
          className={cn(
            "overflow-hidden transition-[max-height,opacity] duration-300 ease-out",
            hideNavbar ? "max-h-0 opacity-0" : "max-h-20 opacity-100",
          )}
        >
          <SiteNavbar variant="inline" />
        </div>
        <SearchTopBar
          query={search.query}
          onSearch={search.setQuery}
          className="border-b border-border bg-gradient-to-r from-brand/5 via-white to-brand/10"
        />
      </div>

      {/* Same lane as search bar */}
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 px-4 sm:px-8">
        {search.hasSearchCriteria ? (
          <aside className="mr-4 hidden w-[260px] shrink-0 overflow-y-auto border-r border-border bg-white xl:mr-6 xl:block xl:w-[280px]">
            {filterSidebar}
          </aside>
        ) : null}

        <div
          id="search-results-scroll"
          ref={resultsScrollRef}
          className="min-h-0 min-w-0 flex-1 overflow-y-auto"
        >
          <div className="py-4">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <ResultsToolbar
                  location={search.query.location}
                  totalResults={search.totalResults}
                  isStreaming={search.isStreamingResults || search.isLoading}
                  mode={search.query.mode}
                  sort={search.sort}
                  view={search.view}
                  nameQuery={search.nameQuery}
                  onNameQueryChange={search.setNameQuery}
                  onSortChange={search.setSort}
                  onViewChange={search.setView}
                />
              </div>

              {search.hasSearchCriteria ? (
                <Dialog
                  open={mobileFiltersOpen}
                  onOpenChange={setMobileFiltersOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="shrink-0 xl:hidden"
                    >
                      <Filter className="mr-2 size-4" />
                      Filters
                      {search.activeFilterCount > 0
                        ? ` (${search.activeFilterCount})`
                        : ""}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-md">
                    <DialogHeader className="sr-only">
                      <DialogTitle>Filters</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[90vh] overflow-y-auto">
                      {filterSidebar}
                    </div>
                  </DialogContent>
                </Dialog>
              ) : null}
            </div>

            <div className="pb-10">
              {!search.hasSearchCriteria ? (
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-white py-20 text-center">
                  <p className="text-lg font-semibold text-foreground">
                    Start your search
                  </p>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    Enter a location, dates, and guests above to see available
                    hotels.
                  </p>
                </div>
              ) : search.error && search.loadedResults === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-white py-20 text-center">
                  <p className="text-lg font-semibold text-foreground">
                    Unable to load hotels
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {search.error}
                  </p>
                  <Button
                    type="button"
                    className="mt-4"
                    onClick={search.reload}
                  >
                    Try again
                  </Button>
                </div>
              ) : search.view === "card" ? (
                search.isLoading && search.loadedResults === 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin text-brand" />
                      {search.useZentrum
                        ? search.totalResults > 0
                          ? `Loading ${search.totalResults} hotels…`
                          : "Searching hotels across suppliers…"
                        : "Loading hotels..."}
                    </div>
                    <PropertyGridSkeleton count={skeletonCount} />
                  </div>
                ) : visibleProperties.length > 0 || showTrailingSkeleton ? (
                  <>
                    {visibleProperties.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {visibleProperties.map((property) => (
                          <PropertyCard
                            key={property.id}
                            property={property}
                            mode={search.query.mode}
                            nights={search.nights}
                            searchParams={detailSearchParams}
                            guestsLabel={search.query.guests}
                          />
                        ))}
                      </div>
                    ) : null}

                    {showTrailingSkeleton ? (
                      <div className="mt-4 space-y-3">
                        {(search.isStreamingResults || loadingMore) && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="size-4 animate-spin text-brand" />
                            Loading more hotels…
                          </div>
                        )}
                        <PropertyGridSkeleton count={skeletonCount} />
                      </div>
                    ) : null}

                    <div ref={sentinelRef} className="h-8 w-full" aria-hidden />

                    {!hasMore && search.loadedResults > 0 ? (
                      <p className="mt-2 text-center text-xs text-muted-foreground">
                        Showing all {search.loadedResults} results
                        {search.totalResults > search.loadedResults
                          ? ` of ${search.totalResults}`
                          : ""}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-white py-20 text-center">
                    <p className="text-lg font-semibold text-foreground">
                      No hotels found
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {search.nameQuery.trim()
                        ? `No hotels match “${search.nameQuery.trim()}”. Try a different name or clear the search.`
                        : "Try adjusting your filters or search location."}
                    </p>
                  </div>
                )
              ) : (
                <SearchMapView
                  properties={search.filteredProperties}
                  searchParams={detailSearchParams}
                  mode={search.query.mode}
                  nights={search.nights}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
