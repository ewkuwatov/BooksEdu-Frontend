import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import Header from '../components/Header/Header'
import Filter from '../components/Filter'
import AdsSideBar from '../components/ads/AdsSideBar'

import '../styles/userLayout.css'

function UserLayout() {
  const [selectedRegions, setSelectedRegions] = useState([])

  return (
    <div className='userLayout'>
      {/* Основной контейнер */}
      <div className="univerContainer">
        {/* Левая панель с фильтрами и рекламой */}
        <aside className="sidebarPanel">
          <Filter
            selectedRegions={selectedRegions}
            onRegionChange={setSelectedRegions}
          />
          <AdsSideBar />
        </aside>

        {/* Контентная часть (страницы пользователя) */}
        <main className="contentPanel">
          <Outlet context={{ selectedRegions }} />
        </main>
      </div>
    </div>
  )
}

export default UserLayout
