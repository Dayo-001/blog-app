"use client";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

const LiveTimeAgo = ({ date }: { date: string | Date }) => {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const update = () => {
      setTimeAgo(formatDistanceToNow(new Date(date), { addSuffix: true }));
    };
    update();
    const refreshInterval = setInterval(update, 60000);
    return () => clearInterval(refreshInterval);
  }, [date]);

  return <span className="text-xs text-gray-400">{timeAgo}</span>;
};

export default LiveTimeAgo;
