import React from 'react'

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">{children}</div>
    </div>
  )
}

export default PageLayout
