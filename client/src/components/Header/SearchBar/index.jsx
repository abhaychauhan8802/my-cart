import { useState } from "react";
import { Input } from "@nextui-org/react";

import { Search } from "lucide-react";

const SearchBar = () => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = async () => {};

  return (
    <form onSubmit={handleSearch}>
      <Input
        isClearable
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onClear={() => setSearchText("")}
        startContent={<Search className="w-4" />}
        classNames={{
          input: "ml-1",
        }}
      />
    </form>
  );
};

export default SearchBar;
