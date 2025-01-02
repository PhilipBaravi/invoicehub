import { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type StatCardSkeletonProps = {
  styles: string;
};

const StatCardSkeleton: FC<StatCardSkeletonProps> = ({ styles }) => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className={`${styles} rounded-xl`} />
    </div>
  );
};

export default StatCardSkeleton;
