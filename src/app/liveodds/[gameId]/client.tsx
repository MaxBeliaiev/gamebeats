"use client"
import { useEffect } from "react"

const LiveOddsClient = ({ competitors, data }: any) => {
  useEffect(() => {
    setTimeout(() => { window.location.reload() }, 3000)
  })

  return (
    <div className='p-4'>
      {
        Object.keys(data).map((key: any) => {
          const competitor = competitors.find((comp: any) => comp.id === Number(key))
          return (
            <div key={key}><b>{competitor?.nickname}</b> - {(data[key] * 100).toFixed(2)}%</div>
        )
        })
      }
      </div>
  )
}

export default LiveOddsClient