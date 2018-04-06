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
document.contractAddress = "0x62227531b82259561cc9ad4413188f08e536598a";
document.gas = 400000 // reduce this to around 80k
document.gasPrice = 5000000000 // 1 GW -> in production we are 1 GW people have fucked up the servers
// https://ropsten.infura.io/uQ1IJxFulSUbz2UfH5OE
var server = "http://localhost:7545";
//var server = "https://ropsten.infura.io/uQ1IJxFulSUbz2UfH5OE";
function setWeb3Provider(keystore) {
    var web3Provider = new HookedWeb3Provider({
        host: server,
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
                Swal.close();
                dispatch(rolesRetrieved(roles));
                dispatch(loginSuccessful(addresses)); // race condition
            }
        })        
    })    
}

function getAddresses(dispatch, password) {
    Swal({
        title: 'Please wait while your addresses are being retrieved',
        text: 'This may take some time depending on network connection',            
        onOpen: () => {
          Swal.showLoading()
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false
      })

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
            
        }
        else {
            let ct = contract({ abi: ABI, address: document.contractAddress });
            console.log(ct);

            ct.setProvider(document.globalWeb3.currentProvider);

            ct.at(document.contractAddress).then((instance) => {
                document.dollarMateContract = instance;
                dispatchRoles(addresses, dispatch);
                //dispatch(loginSuccessful(addresses)); // race condition
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