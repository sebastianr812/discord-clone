"use client";

import { useSocket } from "./providers/SocketProvider";
import { Badge } from "./ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge variant="outline" className="text-white bg-yellow-600 border-none">
        Fallback: Polling every 1s
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-white border-none bg-emerald-600">
      Live: Real-time updates
    </Badge>
  );
};
