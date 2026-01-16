import LeafletMap from '@/features/dashboard/MapView'
import React from 'react'

const LiveMap = () => {
  return (
    <div className="w-full h-[calc(100vh-8rem)] p-4">
      <LeafletMap />
    </div>
  )
}

export default LiveMap