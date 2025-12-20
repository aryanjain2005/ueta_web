// src/components/SearchBar.tsx
import React, { useState, useEffect } from "react";

const SearchBar: React.FC = () => {
  const [searchBy, setSearchBy] = useState<string>("brand");
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<
    { name: string; objectId: string }[]
  >([]);
  const [data, setData] = useState<Record<
    string,
    { name: string; objectId: string }[]
  > | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, productsRes, dealersRes, distributorsRes] =
          await Promise.all([
            fetch("/api/brand/getBrands").then((res) => res.json()),
            fetch("/api/product/getProducts").then((res) => res.json()),
            fetch("/api/auth/getDealers").then((res) => res.json()),
            fetch("/api/auth/getDistributors").then((res) => res.json()),
          ]);

        setData({
          brand: brandsRes.map((b: any) => ({ name: b.name, objectId: b._id })),
          product: productsRes.map((p: any) => ({
            name: p.name,
            objectId: p._id,
          })),
          dealer: dealersRes.map((d: any) => ({
            name: d.name,
            objectId: d._id,
          })),
          distributor: distributorsRes.map((d: any) => ({
            name: d.name,
            objectId: d._id,
          })),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchBy(event.target.value);
    setQuery("");
    setSuggestions([]);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value.toLowerCase();
    setQuery(searchQuery);

    if (data && searchQuery) {
      const filteredSuggestions = data[searchBy]
        ?.filter((item) => {
          const words = item.name.split(/\s+/);
          return words.some((word) =>
            word.toLowerCase().startsWith(searchQuery)
          );
        })
        ?.sort((a, b) => {
          const rank = (item: { name: string }) => {
            const words = item.name.split(/\s+/);
            let positionScore = 0;
            let matchCount = 0;

            words.forEach((word, index) => {
              if (word.toLowerCase().startsWith(searchQuery)) {
                matchCount++;
                positionScore += 100 - index * 10;
              }
            });

            const exactMatchBonus = words.some(
              (word) => word.toLowerCase() === searchQuery
            )
              ? 1000
              : 0;

            return exactMatchBonus + positionScore + matchCount * 10;
          };

          return rank(b) - rank(a);
        });

      setSuggestions(filteredSuggestions || []);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: {
    name: string;
    objectId: string;
  }) => {
    const baseRoute = ["brand", "product"].includes(searchBy)
      ? "/Brand_Product"
      : "/Distributor_dealer";
    window.location.href = `${baseRoute}?objectId=${suggestion.objectId}`;
    // OR for SPA-like navigation (smoother):
    // (window.Astro || window).navigate(`${baseRoute}?objectId=${suggestion.objectId}`);
  };

  return (
    <div className="relative flex items-center bg-white text-black rounded-md px-2">
      <select
        value={searchBy}
        onChange={handleSearchChange}
        className="border-r border-gray-300 px-2 py-1 bg-white rounded-l-md focus:outline-none">
        <option value="brand">Brand</option>
        <option value="product">Product</option>
        <option value="dealer">Dealer</option>
        <option value="distributor">Distributor</option>
      </select>

      <input
        type="text"
        placeholder={`Search ${searchBy}`}
        value={query}
        onChange={handleInputChange}
        className="py-1 px-2 w-48 focus:outline-none"
      />

      {suggestions.length > 0 && (
        <ul className="absolute top-9 left-0 w-full bg-white text-black border border-gray-200 rounded-md shadow-md z-50">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(s)}
              className="p-2 hover:bg-gray-200 cursor-pointer">
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
