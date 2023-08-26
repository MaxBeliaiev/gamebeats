'use client'
import Lottie from 'lottie-react'
import animationData from '@/lib/lottie/test-lottie.json'

export default function LottiePage() {
  return (
    <div className='w-[100px] h-[100px]'>
      <Lottie
        animationData={animationData}
        className="flex justify-center items-center"
        loop={true}
      />
    </div>
  )
}