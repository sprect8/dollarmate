import constants from 'core/types';
import lightwallet from 'eth-lightwallet';
import Web3 from 'web3';
import HookedWeb3Provider from "hooked-web3-provider";
import ABI from '../../assets/abi/DollarMate.json';
import contract from 'truffle-contract';
import Swal from 'sweetalert2'

/*
document.globalWeb3 = new Web3();
document.global_keystore = null;
document._passwd = "";
document.dollarMateContract = null;*/

// assume that the contract is initialised

function _ethBalance(balance) {
    balance = Web3.utils.fromWei(balance.toString());
    return {
        type: constants.ETH_BALANCE,
        balance: balance
    }    
}

function _iDinarBalance(balance) {
    return {
        type: constants.IDINAR_BALANCE,
        iDinar: balance
    }    
}

function _idinarSending(tx) {
    return {
        type: constants.IDINAR_SENT,
        tx: tx
    }    
}

function _accError(coinbase, e) {
    return {
        type: constants.ACC_ERROR,
        coinbase: coinbase,
        error: e
    }
}
export function sendIDinar(coinbase, otherAcc, amount) {
    return function(dispatch) {
        document.dollarMateContract.transfer(otherAcc, amount, {from:coinbase, gas:400000, gasPrice:4000000})
        .then(tx=>{
            dispatch(_idinarSending(tx));
        })
        .catch(e=>{
            dispatch(_accError(coinbase, e));
        });
    }    
}
export function fetchIDinarBalance(coinbase) {
    return function(dispatch) {
        document.dollarMateContract.balanceOf.call(coinbase)   
        .then((results) => {                       
            dispatch(_iDinarBalance(results));
        })
        .catch((e) => {
            dispatch(_accError(coinbase, e));
        })
    }
}
export function fetchEthBalance(coinbase) {
    return function(dispatch) {
        document.globalWeb3.eth.getBalance(coinbase, ((e, results) => {                       
            if (e) {
                dispatch(_accError(coinbase, e));
            }
            else {
                dispatch(_ethBalance(results));
            }
        }))
        .catch((e) => {
            dispatch(_accError(coinbase, e));
        })
    }
}
