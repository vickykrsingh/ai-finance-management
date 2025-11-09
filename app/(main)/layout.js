import React from 'react'

function layout({children}) {
  return (
    <div className='container mx-auto pt-24 pb-12'>{children}</div>
  )
}

export default layout