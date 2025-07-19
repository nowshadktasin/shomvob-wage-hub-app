import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface SkeletonLoaderProps {
  type: 'earnings' | 'transaction' | 'profile' | 'settings';
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type, count = 1 }) => {
  const renderEarningsSkeleton = () => (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full mt-4" />
      </CardHeader>
      <CardContent>
        <div className="text-center p-6 bg-primary/5 rounded-lg mb-4">
          <Skeleton className="h-4 w-20 mx-auto mb-2" />
          <Skeleton className="h-8 w-32 mx-auto" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );

  const renderTransactionSkeleton = () => (
    <Card className="w-full mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-18" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderProfileSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderSettingsSkeleton = () => (
    <div className="space-y-4">
      {[...Array(2)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-10" />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const skeletonMap = {
    earnings: renderEarningsSkeleton,
    transaction: renderTransactionSkeleton,
    profile: renderProfileSkeleton,
    settings: renderSettingsSkeleton,
  };

  return (
    <div className="space-y-3" role="status" aria-label="Loading content">
      {[...Array(count)].map((_, index) => (
        <div key={index}>
          {skeletonMap[type]()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;