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
    <div className='max-w-4xl mx-auto px-5 py-8'>
      <div className='mb-8'>
        <h1 className='text-5xl font-black mb-3'>
          <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600'>
            {editId ? "Edit" : "Add New"}
          </span>
          {" "}Transaction
        </h1>
        <p className='text-gray-600 text-lg'>
          {editId ? "Update your transaction details" : "Record your income or expense transaction"}
        </p>
      </div>
      <AddTransactionForm accounts={accounts} categories={defaultCategories} editMode={!!editId} initialData={initialData} />
    </div>
  )
}

export default AddTransactionPage