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

function _certificateListFetched(certificates) {
    return {
        type: constants.CERT_LIST_FETCHED,
        certificates: certificates
    }
}

function _certificateFetched(certificate) {
    return {
        type: constants.CERT_FETCHED,
        certificate: certificate
    }
}

function _vetCertificate(certId, tx) {
    return {
        type: constants.CERT_VETTED,
        certificateId: certId,
        tx: tx
    }
}

function _mintCertificate(certId, tx) {
    return {
        type: constants.CERT_MINTED,
        certificateId: certId,
        tx: tx
    }    
}

function _rejectCertificate(certId, tx) {
    return {
        type: constants.CERT_REJECTED,
        certificateId: certId,
        tx: tx
    }    
}

function _lockCertificate(certId, tx) {
    return {
        type: constants.CERT_LOCKED,
        certificateId: certId,
        tx: tx
    }    
}

function _unlockCertificate(certId, tx) {
    return {
        type: constants.CERT_UNLOCKED,
        certificateId: certId,
        tx: tx
    }    
}

function _certError(certId, e) {
    return {
        type: constants.CERT_ERROR,
        certificateId: certId,
        error: e
    }
}

function getStatus(status) {

    if (status == 0) {
        status = "PENDING_MINT"
    }
    else if (status == 1) {
        status = "PENDING_VET"
    }
    else if (status == 2) {
        status = "LOCKED";                    
    }
    else if (status == 3) {
        status = "VALID";
    }
    else if (status == 4) {
        status = "INVALID";                    
    }
    else if (status == 5) {
        status = "REJECTED";
    }
    else if (status == 6) {
        status = "WITHDRAWN";
    }
    else {
        status = "UNKNOWN";
    }

    return status;
}

export function fetchCertificates(certIdStart) {
    return function(dispatch) {
        document.dollarMateContract.getCertificateList.call(certIdStart, {from:document.coinbase})
        .then((results) => {            
            let certificates = [];
            let ids = results[0];
            let statuses = results[1];
            let totalDinar = results[2];
            let totalResource = results[3];

            for (var i = 0; i < results.length; ++i) {                
                if (ids[i] == 0) break;
                var status = getStatus(statuses[i]);
                
                certificates.push({
                    "id": ids[i].toString(),
                    "status":status,
                    "totalDinar":totalDinar[i].toString(),
                    "totalResource":totalResource[i].toString()
                })
            }
            dispatch(_certificateListFetched(certificates));
        })
        .catch((e) => {
            dispatch(_certError(certIdStart, e));
        })
    }
}

export function fetchCertificate(certId) {
    return function(dispatch) {
        document.dollarMateContract.getCertificate.call(certId, {from:document.coinbase})
        .then((result) => {
            let custodian = result[0], supportingDocument = result[1], owner = result[2], id = result[3], supply = result[4], totalResources = result[5], required = result[6], status = result[7];
            dispatch(_certificateFetched({
                certId: id.toString(),
                custodian: custodian,
                supportingDocs: supportingDocument,
                owner: owner,
                totalDinar: supply.toString(),                
                totalResources : totalResources.toString(),
                required: required.toString(),
                status: getStatus(status)
            }));
        })
        .catch((e) => {
            dispatch(_certError(certId, e));
        })        
    }
}

export function vetCertificate(certId, amount) {
    return function(dispatch) {
        document.dollarMateContract.vetCoin(certId, amount, {from:document.coinbase, gas:400000, gasPrice:4000000})
        .then((tx) => {
            dispatch(_vetCertificate(certId, tx));
        })
        .catch((e) => {
            dispatch(_certError(certId, e));
        })                        
    }
}

export function mintCertificate(certId) {
    return function(dispatch) {
        document.dollarMateContract.mintCoin(certId, {from:document.coinbase, gas:400000, gasPrice:4000000})
        .then((tx) => {
            dispatch(_mintCertificate(certId, tx));
        })
        .catch((e) => {
            dispatch(_certError(certId, e));
        })                        
    }
}

export function rejectCertificate(certId) {
    return function(dispatch) {
        document.dollarMateContract.rejectCoin(certId, {from:document.coinbase, gas:400000, gasPrice:4000000})
        .then(tx => {
            dispatch(_rejectCertificate(certId, tx));
        })
        .catch((e) => {
            dispatch(_certError(certId, e));
        })                        
    }
}

export function lockCertificate(certId) {
    return function(dispatch) {
        document.dollarMateContract.lockCoin(certId, {from:document.coinbase, gas:400000, gasPrice:4000000})
        .then(tx => {
            dispatch(_lockCertificate(certId, tx));
        })
        .catch((e) => {
            dispatch(_certError(certId, e));
        })                        
    }
}

export function unlockCertificate(certId) {
    return function(dispatch) {
        document.dollarMateContract.unlockCoin(certId, {from:document.coinbase, gas:400000, gasPrice:4000000})
        .then(tx => {
            dispatch(_unlockCertificate(certId, tx));
        })
        .catch((e) => {
            dispatch(_certError(certId, e));
        })                        
    }
}
