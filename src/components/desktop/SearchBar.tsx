"use client";
import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";

const SearchBar = ({ onSearch }: { onSearch: (q: string) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  return (
    <Input
      type="text"
      placeholder="Search posts..."
      className="border border-gray-700 p-3 rounded-xl max-w-auto"
      onChange={(e) => onSearch(e.target.value)}
      ref={inputRef}
    />
  );
};
export default SearchBar;
