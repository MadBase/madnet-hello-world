import React from 'react';
import madNetAdapter from '../adapter/MadNetAdapter';

export const defaultState = {
    connected: false,
    busy: false,
    error: false,
    accounts: [],
    tokenBalances: {}, // K:V where K is address and v is tokenBalance
    tokensSent: false,
    config: {
        mad_net_chainID: false, // Not needed
        mad_net_provider: "", // Testnet from env
    },
    transactions: {
        txOuts: [],
        changeAddress: { "address": "", "bnCurve": false },
        pendingTx: "",
        pendingTxStatus: false,
        pendingLocked: false,
    },
    blocks: {
        list: [],
        status: "",
        started: false,
        current: "",
        locked: false,
    },
    txExplore: {
        txHash: "",
        tx: false,
        txHeight: 0,
    },
    dataExplore: {
        redirected: false,
        searchOpts: false,
        dataStores: [],
        activePage: [],
        dsView: []
    },
    fees: {},
}

export const MadContext = React.createContext(defaultState);

export const addAddressToAccounts = (context, address) => {
    context.setState(s => ({ ...s, accounts: [...s.accounts, address], tokenBalances: { ...s.tokenBalances, [address]: 0 } }));
}

export const updateBalance = async (context, address) => { 
    let [balance] = await madNetAdapter._getMadNetWalletBalanceAndUTXOs(address);
    context.setState(s => ({ ...s, tokenBalances: { ...s.tokenBalances, [address]: balance } }));
}

export const updateTokensSentStatus = (context, status) => {
    context.setState(s => ({ ...s, tokensSent: status }));
}

export const checkForCookieWallet = async (context, cookies) => {
    if (cookies['alice-demo-raw-root']) {
        let walletInstance = madNetAdapter.getMadNetWalletInstance();
        if (walletInstance.Account.accounts.length === 0) { // Only add if not added yet -- Should only ever be one here.
            let pRaw = cookies['alice-demo-raw-root']
            let hash = await walletInstance.Utils.hash("0x" + pRaw.toString());
            await madNetAdapter.getMadNetWalletInstance().Account.addAccount(hash, 1);
            let loadedAddress = await walletInstance.Account.accounts[madNetAdapter.getMadNetWalletInstance().Account.accounts.length - 1].address;
            addAddressToAccounts(context, loadedAddress);
            await updateBalance(context, loadedAddress);
        }
    } else { return }
}

/**
 * Provide MadAdapter context where needed
 */
export function MadProvider({ children }) {

    const [state, setState] = React.useState(defaultState);

    return (
        <MadContext.Provider value={{ state: state, setState: setState }}>
            {children}
        </MadContext.Provider>
    )

}
