import React, { useState, useEffect} from 'react'
import {useAsyncTimeout} from "@hooks/useAsyncTimeout";
import { bnToBig } from './helpers';

function useBalance(xchain, address) {
    const [balance, setBalance] = useState(0);

    const fetchAllBalancesFromAddress = async () => {
        let balances = await xchain.getAllBalances(address);
        const avaxBalance = balances.filter(x => x.asset === 'AVAX').pop();
        const avaxBalanceValue = avaxBalance ? bnToBig(avaxBalance.balance, 9).toString() : "0";
        return avaxBalanceValue;
    }

    useAsyncTimeout(async function () {
        const avaxBalance = await ())
    })
}

export default useBalance;
