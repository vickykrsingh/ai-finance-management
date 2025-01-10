import { getUserAccounts } from '@/actions/dashboard'
import { defaultCategories } from '@/data/categories';
import React from 'react'
import AddTransactionForm from '../_components/transaction-form';

async function AddTransactionPage() {
  const accounts = await getUserAccounts();
  return (
    <div className='max-w-3xl mx-auto px-5'>
      <h1 className='text-5xl gradient-title' >Add Transaction</h1>
      <AddTransactionForm accounts={accounts} categories={defaultCategories} />
    </div>
  )
}

export default AddTransactionPage