"use client";

import { AiOutlineSearch } from "react-icons/ai";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import React, { useState, useCallback } from "react";
import _ from "lodash";
import Link from "next/link";
import { User as NextAuthUser } from "next-auth";

interface SearchProps {
  placeholder: string;
  user: NextAuthUser;
}

const Search: React.FC<SearchProps> = ({ placeholder, user }) => {
  const [results, setResults] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const fetchResults = async (query: string) => {
    if (!query) return setResults([]);

    try {
      const response = await fetch(`/api/users/searchQuizSets/${query}`);
      if (!response.ok) {
        console.error("Failed to fetch results:", response.statusText);
        return;
      }
      const data = await response.json();
      if (data.quizSets) {
        setResults(data.quizSets);
      } else {
        console.error("Unexpected response structure:", data);
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      setResults([]);
    }
  };

  const handleSearch = useCallback(
    _.debounce((term: string) => {
      const params = new URLSearchParams(searchParams as any);
      if (term) {
        params.set("query", term);
      } else {
        params.delete("query");
      }
      replace(`${pathname}?${params.toString()}`);
      fetchResults(term);
    }, 300),
    []
  );
  return (
    <div className="relative flex flex-1">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-[#ff01fb] py-[9px] pl-10 text-sm text-black"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams?.get("query")?.toString()}
      />
      <AiOutlineSearch className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#ff01fb]" />
      {results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white border border-[#ff01fb] rounded-md z-10 shadow-lg p-2">
          {results.map((result) => (
            <Link
              href={`/quizSet?quizSetId=${result._id}&role=${user.role}&id=${user.id}`}
              key={result.id}
            >
              <div
                key={result.id}
                className="p-2 hover:bg-gray-100 cursor-pointer transition duration-500 hover:scale-105"
              >
                <p className="font-bold text-black text-xl">{result.title}</p>
                <p className="text-sm text-gray-600">{result.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
