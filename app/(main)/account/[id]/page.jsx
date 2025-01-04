import { getAccountWithTransactions } from "@/actions/accounts";
import notfound from "@/app/not-found";
import React from "react";

async function UserAccount({ params }) {
  const { id } = await params;
  const accountData = await getAccountWithTransactions(id);

  if (!accountData) {
    return notfound();
  }

  const { transaction, ...account } = accountData;
  return (
    <div className="space-y-8 px-5 flex gap-4 items-end justify-between">
      <div>
        <h1 className="text-5xl sm:text-6xl font-bold gradient-title capitalize">{account.name}</h1>
        <p className="text-muted-foreground">
          {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
        </p>
      </div>
      <div className="pb-2 text-right">
        <div className="text-xl sm:text-2xl font-bold">${parseFloat(account.balance).toFixed(2)}</div>
        <p className="text-sm text-muted-foreground">{account._count.transactions} Transaction</p>
      </div>
      {/* Chart section */}


      {/* Transaction section */}
    </div>
  );
}

export default UserAccount;
