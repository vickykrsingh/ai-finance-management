import React, { Suspense } from 'react'
import Dashboard from './page.jsx'
import {BarLoader} from 'react-spinners'

function layout() {
  return (
    <section>
        <h1 className='text-6xl gradient-title font-bold mb-5'>Dashboard</h1>
        <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#9333ea'/>}>
            <Dashboard/>
        </Suspense>
    </section>
  )
}

export default layout