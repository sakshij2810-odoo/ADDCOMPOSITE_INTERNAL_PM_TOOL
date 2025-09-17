import React from "react";
// @ts-ignore
import Fuse from "fuse.js";

interface ISearch<T> {
  items: T;
  options: {
    keys: string[];
  };
}

export const useSearch = <Itemstype>(searchConfig: ISearch<Itemstype>) => {
  const [search, setSearch] = React.useState<string>("");
  const [searchedItems, setSearchedItems] = React.useState<
    Itemstype | Itemstype[]
  >([]);

  React.useEffect(() => {
    if (search.length > 0) {
      const fuse = new Fuse(searchConfig.items as any, {
        ...searchConfig.options,
        threshold: 0.0,
      });
      const result = fuse.search(search);
      const finalSearchedItems: any = [];
      result.forEach((searchedItem: any) => {
        finalSearchedItems.push(searchedItem.item);
      });
      setSearchedItems(finalSearchedItems);
    } else {
      setSearchedItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleResetSearch = () => {
    setSearch("");
  }

  const finalItems = search.length > 0 ? searchedItems : searchConfig.items;

  return {
    items: finalItems as Itemstype,
    search,
    onSearchChange: handleSearch,
    resetSearch: handleResetSearch,
  };
};
