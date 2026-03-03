function SkeletonGrid() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3.5">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-2xl border-[1.5px] border-card bg-card-gradient"
        >
          <div className="h-40 bg-skeleton" />
          <div className="flex flex-col gap-2 p-[12px_14px_14px]">
            <div className="h-4.5 w-[45%] rounded bg-skeleton" />
            <div className="h-3.5 w-[85%] rounded bg-skeleton" />
            <div className="h-3.5 w-[60%] rounded bg-skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="p-4">
      <SkeletonGrid />
    </div>
  );
}
