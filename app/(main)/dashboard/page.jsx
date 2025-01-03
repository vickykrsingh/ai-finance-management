import CreateAccountDrawer from '@/components/create-account-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import React from 'react'

function Dashboard() {
  return (
    <section className='px-5'>
        {/* Budget Progress */}

        {/* Overview */}

        {/* Account Grid */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <CreateAccountDrawer>
                <Card className="hover:shadow-md transition-shadow  cursor-pointer border-dashed">
                    <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                        <Plus className='h-10 w-10 mb-2'/>
                        <p className='text-sm font-medium'>Add New Account</p>
                    </CardContent>
                </Card>
            </CreateAccountDrawer>
        </div>
    </section>
  )
}

export default Dashboard