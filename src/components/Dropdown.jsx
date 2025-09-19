import React from 'react'

import '../styles/Dropdown.css'

const Dropdown = ({
  label,
  value,
  options,
  onSelect,
  openKey,
  openDropdown,
  setOpenDropdown,
}) => (
  <div className="dropdown-wrapper">
    <label>{label}</label>
    <div
      className="dropdown"
      onClick={() =>
        setOpenDropdown((prev) => ({
          ...prev,
          [openKey]: !prev[openKey],
        }))
      }
    >
      {value || `-- выберите ${label} --`}
    </div>
    {openDropdown[openKey] && (
      <ul className="dropdown-list">
        {options.map((opt) => (
          <li
            key={opt.value}
            className="dropdown-item"
            onClick={() => {
              onSelect(opt.value)
              setOpenDropdown((prev) => ({ ...prev, [openKey]: false }))
            }}
          >
            {opt.label}
          </li>
        ))}
      </ul>
    )}
  </div>
)

export default Dropdown
