import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input"; // ShadCN Input
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { blogData, BlogData } from "@/lib/data";
import { hastags } from "@/lib/data";
import { FaSearch } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<
    "default" | "latest" | "oldest" | string
  >("");

  const dropdownContentRef = useRef(null);

  const handleScroll = () => {
    const element = dropdownContentRef.current;
    if (element) {
      const maxScroll = element.scrollHeight - element.clientHeight;
      const scrollPercent = (element.scrollTop / maxScroll) * 100;
      setScrollProgress(scrollPercent);
    }
  };
  var filteredBlogs = blogData.filter((blog: BlogData) => {
    const matchesSearch =
      blog.blogTopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  if (selectedTag && selectedTag !== "all") {
    filteredBlogs = filteredBlogs?.filter((blog: BlogData) =>
      blog.hashtags.includes(selectedTag)
    );
  }

  if (selectedTag === "all" && !searchQuery) {
    filteredBlogs = blogData;
  }

  if (sortBy === "latest") {
    filteredBlogs = [...filteredBlogs].sort(
      (a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
  } else if (sortBy === "oldest") {
    filteredBlogs = [...filteredBlogs].sort(
      (a, b) =>
        new Date(a.published_at).getTime() - new Date(b.published_at).getTime()
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      {/* Fixed Top Section */}
      <div className="sticky top-0 z-50 bg-gray-50 w-full flex flex-col items-center justify-center p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold mb-4">Blog Search</h1>

        <div className="flex flex-col sm:flex-row items-center w-full sm:max-w-lg space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="relative w-full flex">
            <Input
              type="text"
              placeholder="Search by topic or author... "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3"
            />
            <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 " />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {selectedTag ? selectedTag : "Search By hashtag"}{" "}
                <FaChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              onScroll={handleScroll}
              className="w-56 max-h-48 overflow-y-auto no-scrollbar relative"
            >
              <div
                className="absolute top-0 right-0 w-1 bg-blue-500"
                style={{
                  height: `${scrollProgress}%`,
                }}
              ></div>
              <DropdownMenuLabel>Hashtags</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem onClick={() => setSelectedTag("all")}>
                All
              </DropdownMenuCheckboxItem>

              {hastags &&
                hastags.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag.id}
                    onClick={() => setSelectedTag(tag.name)}
                  >
                    {tag.name}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {sortBy ? sortBy : "Sort By"} <FaChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem onClick={() => setSortBy("default")}>
                Default
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem onClick={() => setSortBy("latest")}>
                Latest
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem onClick={() => setSortBy("oldest")}>
                Oldest
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full sm:max-w-6xl mx-7 mt-6">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((result: BlogData) => (
            <div
              key={result.id}
              className="w-full sm:w-96 mx-auto bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden mb-6"
            >
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300 truncate">
                  {result.blogTopic}
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  By{" "}
                  <span className="font-semibold text-gray-700">
                    {result.author_name}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Published on:{" "}
                  <span className="italic">
                    {new Date(result.published_at).toLocaleDateString()}
                  </span>
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {result.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-blue-600 bg-blue-100 rounded-full px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No blogs found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
