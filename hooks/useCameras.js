import { useEffect, useState, useCallback } from 'react'

const useCameras = () => {
  const [cameras, setCameras] = useState([])

  const fetchCameras = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = devices.filter(
      (device) => device.kind === 'videoinput'
    )
    videoDevices && setCameras(videoDevices)
  }, [])

  useEffect(() => {
    fetchCameras()
  }, [fetchCameras])
  return cameras
}

export default useCameras
