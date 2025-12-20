// src/components/SearchBar.tsx
import React, { useState, useEffect } from "react";

type Props = {
  isAdmin?: boolean;
  isDistributor?: boolean;
};

const SearchBar: React.FC<Props> = ({
  isAdmin = false,
  isDistributor = false,
}) => {
  const canSeeDistributor = isAdmin || isDistributor;
  const [searchBy, setSearchBy] = useState<string>("all");
  const [query, setQuery] = useState<string>("");
  type BaseItem = {
    name: string;
    slug: string;
    type: "brand" | "product" | "dealer" | "distributor";
    shopName?: string;
  };

  type Item = BaseItem & {
    matchedField?: "name" | "shopName";
  };

  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [data, setData] = useState<{
    brand: BaseItem[];
    product: BaseItem[];
    dealer: BaseItem[];
    distributor: BaseItem[];
  } | null>(null);

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
          brand: brandsRes.map((b: any) => ({
            name: b.name,
            slug: b.slug,
            type: "brand",
          })),
          product: productsRes.map((p: any) => ({
            name: p.name,
            slug: p.slug,
            type: "product",
          })),
          dealer: dealersRes.map((d: any) => ({
            name: d.name,
            slug: d.slug,
            type: "dealer",
            shopName: d.shopName, // ✅ matches columns: { shopName: true }
          })),
          distributor: distributorsRes.map((d: any) => ({
            name: d.name,
            slug: d.slug,
            type: "distributor",
            shopName: d.shopName, // ✅
          })),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === "distributor" && !canSeeDistributor) {
      setSearchBy("all");
    } else {
      setSearchBy(value);
    }
    setQuery("");
    setSuggestions([]);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value.toLowerCase();
    setQuery(searchQuery);

    if (!data || !searchQuery) {
      setSuggestions([]);
      return;
    }

    let pool: Item[] = [];

    if (searchBy === "all") {
      pool = [
        ...data.brand,
        ...data.product,
        ...data.dealer,
        ...(canSeeDistributor ? data.distributor : []),
      ];
    } else if (searchBy === "distributor") {
      pool = canSeeDistributor ? data.distributor : [];
    } else {
      pool = data[searchBy] || [];
    }

    const filtered: Item[] = pool
      .map<Item | null>((item) => {
        const lowerQuery = searchQuery.trim().toLowerCase();

        const nameMatch = item.name.toLowerCase().includes(lowerQuery);
        const shopMatch = item.shopName
          ? item.shopName.toLowerCase().includes(lowerQuery)
          : false;

        if (!nameMatch && !shopMatch) return null;

        const matchedField: "name" | "shopName" =
          shopMatch && !nameMatch ? "shopName" : "name";

        return { ...item, matchedField };
      })
      .filter((item): item is Item => item !== null)
      .sort((a, b) => {
        const rank = (item: Item) => {
          const fields: string[] = [item.name];
          if (item.shopName) fields.push(item.shopName);

          let score = 0;
          fields.forEach((field) => {
            const words = field.split(/\s+/);
            words.forEach((word, index) => {
              const w = word.toLowerCase();
              if (w.startsWith(searchQuery)) {
                score += 100 - index * 10;
              }
              if (w === searchQuery) {
                score += 1000;
              }
            });
          });
          return score;
        };
        return rank(b) - rank(a);
      });

    setSuggestions(filtered);
  };

  const handleSuggestionClick = (item: Item) => {
    let baseRoute = "/";
    switch (item.type) {
      case "brand":
        baseRoute = "/brand";
        break;
      case "product":
        baseRoute = "/product";
        break;
      case "dealer":
        baseRoute = "/dealer";
        break;
      case "distributor":
        baseRoute = "/distributor";
        break;
    }

    window.location.href = `${baseRoute}/${item.slug}`;
  };

  return (
    <div className="relative flex items-center bg-white text-black rounded-md px-2">
      <select
        value={searchBy}
        onChange={handleSearchChange}
        className="border-r border-gray-300 px-2 py-1 bg-white rounded-l-md focus:outline-none">
        <option value="all">All</option>
        <option value="brand">Brand</option>
        <option value="product">Product</option>
        <option value="dealer">Dealer</option>
        {canSeeDistributor && <option value="distributor">Distributor</option>}
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
          {suggestions.map((s, i) => {
            const mainLabel =
              s.matchedField === "shopName" && s.shopName ? s.shopName : s.name;
            const secondaryLabel =
              s.matchedField === "shopName" && s.shopName ? s.name : s.shopName;

            return (
              <li
                key={i}
                onClick={() => handleSuggestionClick(s)}
                className="p-2 hover:bg-gray-200 cursor-pointer">
                <div className="flex flex-col">
                  <span className="font-medium">{mainLabel}</span>
                  {secondaryLabel && (
                    <span className="text-xs text-gray-500">
                      {secondaryLabel}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400 uppercase">
                    {s.type}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
