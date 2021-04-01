import React from 'react';

function FilterMenu(props: { changeFilter: (filter: string) => void }) {
  const filters = ['Sunglasses', 'CoolerSunglasses'];

  return (
    <div className="filterMenu">
      {
        filters.map(filter => 
          <div className={`icon icon-${filter}`} 
            onClick={() => props.changeFilter(filter)}>
              {filter}
          </div>  
        )
      }
    </div>
  );
}

export default FilterMenu;