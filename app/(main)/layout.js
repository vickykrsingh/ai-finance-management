import React from 'react'

function layout({children}) {
  return (
    <div className='container mx-auto my-32'>{children}</div>
  )
}

export default layout