import React, { useState, createContext } from "react";

const FilterContext = createContext();

export const FilterProvider = (props) => {
  const [filterData, setfilterData] = useState({
    category: -1,
    type: "",
    coat: "",
    color: "",
    breed: "",
    lat: "",
    lng: "",
    rad: 30,
  });

  return (
    <FilterContext.Provider value={[filterData, setfilterData]}>
      {props.children}
    </FilterContext.Provider>
  );
};

export default FilterContext;
