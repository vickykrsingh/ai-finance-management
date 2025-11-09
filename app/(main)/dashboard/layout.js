import React, { Suspense } from 'react'
import Dashboard from './page.jsx'
import {BarLoader} from 'react-spinners'

function layout() {
  return (
    <section>
        <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#9333ea'/>}>
            <Dashboard/>
        </Suspense>
    </section>
  )
}

export default layout