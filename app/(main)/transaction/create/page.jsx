export const dynamic = "force-dynamic";
import { getUserAccounts } from '@/actions/dashboard'
import { defaultCategories } from '@/data/categories';
import React from 'react'
import AddTransactionForm from '../_components/transaction-form';
import { getTransaction } from '@/actions/transaction';

async function AddTransactionPage({searchParams}) {
  const accounts = await getUserAccounts();
  const params = await searchParams;
  const editId = params.edit;

  let initialData = null;
  if(editId){
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }
  return (
    <div className='max-w-3xl mx-auto px-5'>
      <h1 className='text-5xl gradient-title' >{editId?"Edit":"Add"} Transaction</h1>
      <AddTransactionForm accounts={accounts} categories={defaultCategories} editMode={!!editId} initialData={initialData} />
    </div>
  )
}

export default AddTransactionPage