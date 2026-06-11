import React from "react";

/**
 * Base Skeleton component
 * @param {Object} props
 * @param {string} props.className - Additional classes for sizing and styling
 */
export function Skeleton({ className = "" }) {
  return (
    <div
      className={`bg-secondary-container/50 animate-pulse rounded-lg relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-container/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 6 }) {
  return (
    <div className="bg-secondary-container shadow-lg/30 rounded-lg overflow-x-auto border border-white/5 p-4 space-y-4">
      {/* Header Skeleton */}
      <div className="flex gap-4 border-b border-white/5 pb-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-6 flex-1 bg-white/5" />
        ))}
      </div>
      
      {/* Rows Skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 items-center">
          {/* Avatar/Image placeholder for first col usually */}
          <Skeleton className="h-12 w-12 rounded-full shrink-0" />
          {Array.from({ length: columns - 1 }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-secondary-container rounded-lg p-4 flex flex-col gap-4 border border-white/5 shadow-lg/30 h-[380px]">
      <Skeleton className="w-full h-48 rounded-md" />
      <div className="space-y-2 mt-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="mt-auto space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}

export function KPICardSkeleton() {
  return (
    <div className="bg-secondary-container shadow-lg/30 p-6 rounded-lg border border-white/5 flex flex-col gap-4 h-[140px]">
      <div className="flex justify-between">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-3/4" />
    </div>
  );
}

export function AuthFormSkeleton() {
  return (
    <div className="w-full max-w-md bg-secondary-container backdrop-blur-xl p-8 rounded-lg border border-white/5 shadow-2xl/50 mx-auto">
      <div className="text-center mb-8 flex flex-col items-center">
         <Skeleton className="h-12 w-32 mb-4" />
         <Skeleton className="h-4 w-48" />
      </div>
      <div className="space-y-6">
        <div>
           <Skeleton className="h-4 w-24 mb-2" />
           <Skeleton className="h-12 w-full" />
        </div>
        <div>
           <Skeleton className="h-4 w-24 mb-2" />
           <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-12 w-full mt-8" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-secondary-container rounded-lg p-6 border border-white/5 flex items-center gap-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-3 flex-1">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/5" />
        </div>
      </div>
      
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICardSkeleton />
        <KPICardSkeleton />
        <KPICardSkeleton />
      </div>
      
      {/* Content list */}
      <div className="space-y-4">
         <Skeleton className="h-8 w-48 mb-6" />
         <div className="bg-secondary-container p-4 rounded-lg border border-white/5">
            <Skeleton className="h-24 w-full" />
         </div>
         <div className="bg-secondary-container p-4 rounded-lg border border-white/5">
            <Skeleton className="h-24 w-full" />
         </div>
      </div>
    </div>
  );
}
