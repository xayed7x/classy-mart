
"use client";

import React from 'react';

interface FilterSidebarProps {
  filterOptions: {
    size: string[];
    color: string[];
  };
  onFilterChange: (filterType: string, value: string) => void;
  onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filterOptions, onFilterChange, onClose }) => {
  const handleFilterChangeAndClose = (filterType: string, value: string) => {
    onFilterChange(filterType, value);
    onClose();
  };

  return (
    <div className="p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      <div>
        <h4 className="font-semibold mb-2">Size</h4>
        {filterOptions.size.map((size) => (
          <div key={size} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`size-${size}`}
              onChange={() => handleFilterChangeAndClose('size', size)}
              className="mr-2"
            />
            <label htmlFor={`size-${size}`}>{size}</label>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Color</h4>
        {filterOptions.color.map((color) => (
          <div key={color} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`color-${color}`}
              onChange={() => handleFilterChangeAndClose('color', color)}
              className="mr-2"
            />
            <label htmlFor={`color-${color}`}>{color}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;
