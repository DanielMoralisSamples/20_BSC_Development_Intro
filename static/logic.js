Moralis.initialize("JKmnIp6jgxbPm3b23rBwKFyqR3WzTcQVLsVKFzjp"); //Application ID
Moralis.serverURL = "https://0qpf67x66rqw.moralisweb3.com:2053/server"; //Server URL 

/* Valid values for chain in https://docs.moralis.io/moralis-server/transactions-and-balances/intro */
const chainToQuery = 'bsc testnet'

async function login(){
    Moralis.Web3.authenticate().then(function (user){
        user.set("name", document.getElementById('username').value);
        user.set("email", document.getElementById('email').value);
        user.save();
        deactivateControls();
        populate();
    })
}

function deactivateControls(){
    document.getElementById('login').setAttribute("disabled", null);
    document.getElementById('username').setAttribute("disabled", null);
    document.getElementById('email').setAttribute("disabled", null);
}

async function populate(){
    const balances = await Moralis.Web3API.account.getTokenBalances({chain: chainToQuery}).then(buildTableBalances);
    const nft = await Moralis.Web3API.account.getNFTs({chain: chainToQuery}).then(buildTableNFT);
    const transtactions = await Moralis.Web3API.account.getTransactions({chain: chainToQuery}).then(buildTableTransactions);

}

function buildTableBalances(data){
    document.getElementById("resultBalances").innerHTML = `<table class="table table-dark table-striped" id="balancesTable">
                                                            </table>`;
    const table = document.getElementById("balancesTable");
    const rowHeader = `<thead>
                            <tr>
                                <th>Token</th>
                                <th>Symbol</th>
                                <th>Balance</th>
                            </tr>
                        </thead>`
    table.innerHTML += rowHeader;
    for (let i=0; i < data.length; i++){
        let row = `<tr>
                        <td>${data[i].name}</td>
                        <td>${data[i].symbol}</td>
                        <td>${data[i].balance/10**18}</td>
                    </tr>`
        table.innerHTML += row
    }
}

function buildTableNFT(_data){
    let data = _data.result;
    document.getElementById("resultNFT").innerHTML = `<table class="table table-dark table-striped" id="nftTable">
                                                            </table>`;
    const table = document.getElementById("nftTable");
    const rowHeader = `<thead>
                            <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Contract</th>
                            </tr>
                        </thead>`
    table.innerHTML += rowHeader;
    for (let i=0; i < data.length; i++){
        let row = `<tr>
                        <td>${data[i].token_id}</td>
                        <td>${data[i].contract_type}</td>
                        <td>${data[i].token_address}</td>
                    </tr>`
        table.innerHTML += row
    }
}

function buildTableTransactions(_data){
    console.log(_data)
    const current = ethereum.selectedAddress;
    let data = _data.result;
    document.getElementById("resultTransactions").innerHTML = `<table class="table table-dark table-striped" id="transactionsTable">
                                                            </table>`;
    const table = document.getElementById("transactionsTable");
    const rowHeader = `<thead>
                            <tr>
                                <th>Type</th>
                                <th>From/To</th>
                                <th>Value</th>
                            </tr>
                        </thead>`
    table.innerHTML += rowHeader;
    for (let i=0; i < data.length; i++){
        let type = "";
        if (data[i].from_address == current){
            type = "Outgoing";
            fromTo = data[i].to_address;
        }
        else {
            type = "Incoming";
            fromTo = data[i].from_address;
        }
        let row = `<tr>
                        <td>${type}</td>
                        <td>${fromTo}</td>
                        <td>${data[i].value/10**18}</td>
                    </tr>`
        table.innerHTML += row
    }
}



