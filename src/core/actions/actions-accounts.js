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
    Swal(
        'Error occurred',
        'Error occurred interacting with your account, error was ' + e,
        'error'
      );
    return {
        type: constants.ACC_ERROR,
        coinbase: coinbase,
        error: e
    }
}
export function sendIDinar(coinbase, otherAcc, amount) {
    Swal({
        title: 'Please wait while we transfer the iDinar',
        text: 'Sending ' + amount + ' iDinar to [' + otherAcc + ']. Your request is being processed on a public blockchain. During times it may be congested. This may take upwards of 5 minutes to complete.',            
        onOpen: () => {
          Swal.showLoading()
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false
      })
    return function(dispatch) {
        document.dollarMateContract.transfer(otherAcc, amount, {from:coinbase, gas:document.gas, gasPrice:document.gasPrice})
        .then(tx=>{
            Swal.close();
            Swal({title: 'Successfully Transferred iDinar', html:'Certificate Transferred iDinar between two accounts succesfully, View details here: <a target="_blank" href="https://ropsten.etherscan.io/tx/' + tx.tx +'">Txn Details</a>', type:'success'})
            
            dispatch(_idinarSending(tx));
            fetchIDinarBalance(coinbase);
            fetchEthBalance(coinbase); // refresh my balance
        })
        .catch(e=>{
            Swal.close();
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
