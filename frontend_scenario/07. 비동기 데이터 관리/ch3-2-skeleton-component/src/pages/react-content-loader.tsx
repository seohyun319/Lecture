/* eslint-disable @next/next/no-img-element */
import { InstagramLoader } from "@/components/react-content-loader/ReactContentLoader";
import { Post } from "@/components/react-loading-skeleton/ReactLoadingSkeletonLine";
import { TableTheming } from "@/components/react-loading-skeleton/ReactLoadingSkeletonTable";
import React, { useState } from "react";

const Example: React.FC = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div>
      <h3>React content loader</h3>
      <InstagramLoader />
    </div>
  );
};

export default Example;
