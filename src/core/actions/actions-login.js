import constants from 'core/types';
import lightwallet from 'eth-lightwallet';
import Web3 from 'web3';
import HookedWeb3Provider from "hooked-web3-provider";
import ABI from '../../assets/abi/DollarMate.json';
import contract from 'truffle-contract';
import Swal from 'sweetalert2'

document.globalWeb3 = new Web3();
document.global_keystore = null;
document._passwd = "";
document.dollarMateContract = null;
document.coinbase = null;
document.contractAddress = "0xe2b043315d9c7232b8fbe88c315484244bc370e1";
// https://ropsten.infura.io/uQ1IJxFulSUbz2UfH5OE
function setWeb3Provider(keystore) {
    var web3Provider = new HookedWeb3Provider({
        host: "https://ropsten.infura.io/uQ1IJxFulSUbz2UfH5OE",
        transaction_signer: keystore
    });

    document.globalWeb3.setProvider(web3Provider);         
}

function loginSuccessful(addresses) {
    console.log(document.dollarMateContract);
    return {
        type: constants.LOGIN,
        addresses: addresses,        
        contract: document.dollarMateContract,
        password: document._passwd
    };
}

function rolesRetrieved(roles) {
    return {
        type: constants.ROLES_RETRIEVED,
        roles: roles
    }
}

function dispatchRoles(addresses, dispatch) {
    var roles = [];
    addresses.forEach((add) => {
        var addr = add;
        document.dollarMateContract.whoAmI.call({from:add}).then((r)=>{
            roles.push({address:addr, role:r.toString()});

            if (roles.length == 4) {
                dispatch(rolesRetrieved(roles));
            }
        })        
    })    
}

function getAddresses(dispatch, password) {

    document.global_keystore.keyFromPassword(password, function (err, pwDerivedKey) {
        if (err) {
            Swal('Error occurred while processing', 'Something went wrong! Error was ' + err, 'error');
            return
        }
        try {
            document.global_keystore.generateNewAddress(pwDerivedKey, 4);
        }
        catch (e) {
            Swal('Error occurred while processing', 'Something went wrong! Error was ' + e, 'error');
            return
        }

        var addresses = document.global_keystore.getAddresses();
        // document.coinbase = addresses[0]; // but we need to select!
        if (document.dollarMateContract) {
            dispatchRoles(addresses, dispatch);
            dispatch(loginSuccessful(addresses)); // race condition
        }
        else {
            let ct = contract({ abi: ABI, address: document.contractAddress });
            console.log(ct);

            ct.setProvider(document.globalWeb3.currentProvider);

            ct.at(document.contractAddress).then((instance) => {
                document.dollarMateContract = instance;
                dispatchRoles(addresses, dispatch);
                dispatch(loginSuccessful(addresses)); // race condition
            });
        }        
    });
    
}

export function register(seed, password) {
    return function (dispatch) {
        
        // register 
        // localStorage.setItem      
        lightwallet.keystore.createVault({
            password: password,
            seedPhrase: seed,
            //random salt 
            hdPathString: "m/0'/0'/0'"
        }, function (err, ks) {
            document.global_keystore = ks

            localStorage.setItem("keyStore", ks.serialize());
            setWeb3Provider(ks);
            document._passwd = password;
            getAddresses(dispatch, password);
        })
    }
}

export function login(password) {
    return function (dispatch) {
        document.global_keystore = lightwallet.keystore.deserialize(localStorage.getItem("keyStore"));
        setWeb3Provider(document.global_keystore);
        document._passwd = password;
        getAddresses(dispatch, password);
    }
}

export function useAddress(address) {
    return function(dispatch) {
        document.coinbase = address; // this is the guy that is logged in
        dispatch({type:constants.SELECT_USER, coinbase: address});
    }
}   

export function logout() {
    return function(dispatch) {
        dispatch({type:constants.LOGOUT});
    }
}