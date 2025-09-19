import React, { useState } from 'react'
import { UniverAddress } from '../constants/enums'
import '../styles/Filter.css'

const Filter = ({ selectedRegions, onRegionChange }) => {
  const [open, setOpen] = useState(false)

  const handleToggle = (region) => {
    if (selectedRegions.includes(region)) {
      onRegionChange(selectedRegions.filter((r) => r !== region))
    } else {
      onRegionChange([...selectedRegions, region])
    }
  }

  const handleReset = () => {
    onRegionChange([])
  }

  return (
    <div className="filterContainer">
      <div className="filterHeader">
        <h3>Фильтры</h3>
        <button className="resetBtn" onClick={handleReset}>
          Reset
        </button>
      </div>

      <div className="dropdown">
        <div className="dropdownHeader" onClick={() => setOpen(!open)}>
          <span>Region</span>
          <span className={`arrow ${open ? 'open' : ''}`}>&#9662;</span>
        </div>

        {open && (
          <div className="dropdownList">
            {Object.entries(UniverAddress).map(([key, value]) => (
              <label key={key} className="dropdownItem">
                <input
                  type="checkbox"
                  checked={selectedRegions.includes(value)}
                  onChange={() => handleToggle(value)}
                />
                {value}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Filter
