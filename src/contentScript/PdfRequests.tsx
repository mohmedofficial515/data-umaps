"use client"
import React from 'react'
import DownloadLayers from './components/dwonloadLayers'
import DownloadGeoJson from './components/downloadGeoJeson'
import TileDownloader from './components/downloadPBFFile'
import DownloadGeoJsonTest from './components/downloadGeoJeson-test'
import DownloadGeoJesonByRegion from './components/downloadGeoJesonByRegion'
import SecurityTestForm from './components/SecurityTestForm'


export default function PdfRequests() {
  return (
    <div className="w-[50vh] h-[100vh] bg-gray-100 p-2 shadow-lg overflow-y-auto py-6 flex items-center flex-col">
      <TileDownloader/>
      <DownloadGeoJesonByRegion/>  
      {/* <SecurityTestForm/> */}
      {/* <DownloadGeoJson/> */}
      {/* <DownloadLayers/> */}
    </div>
  )
}



// /Account/RegisterRequest?returnurl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3DGis.Portal.Umaps%26redirect_uri%3Dhttps%253A%252F%252Fumaps.balady.gov.sa%252Fauth-callback%26response_type%3Dcode%26scope%3DGis.Portal.Umaps.API%26state%3Dfb1b5cb0a883423eb0f701d3f22f6591%26code_challenge%3Dc0Ylic3IqTI7xHUdkRN5uMD0jBUxxMisf3ZOLLDxJQk%26code_challenge_method%3DS256%26response_mode%3Dquery