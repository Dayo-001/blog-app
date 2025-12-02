"use client";
import { Button } from "@/components/ui/button";

const TagFilter = ({
  tags,
  activeTag,
  onSelect,
}: {
  tags: string[];
  activeTag: string | null;
  onSelect: (tag: string | null) => void;
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto whitespace-nowrap mt-4 py-1 custom-scrollbar">
      <Button
        onClick={() => onSelect(null)}
        className={`px-3 py-1 rounded ${
          activeTag === null
            ? "bg-black text-white"
            : "bg-gray-300 text-gray-500 hover:text-gray-50 hover:bg-gray-600"
        }`}
      >
        All
      </Button>

      {tags.map((tag) => (
        <Button
          key={tag}
          onClick={() => onSelect(tag)}
          className={`px-3 py-1 rounded ${
            activeTag === tag
              ? "bg-black text-white"
              : "bg-gray-300 text-gray-500 hover:text-gray-50 hover:bg-gray-600"
          }`}
        >
          #{tag}
        </Button>
      ))}
    </div>
  );
};
export default TagFilter;
