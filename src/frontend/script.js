document.addEventListener('DOMContentLoaded', function () {
    const connectWalletButton = document.getElementById('connectWallet');
    const disconnectWalletButton = document.getElementById('disconnectWallet');
    const walletAddressText = document.getElementById('walletAddress');
    const referenceText = document.getElementById('referenceText');
    const ethBalanceDisplay = document.getElementById('ethBalance');
    let web3; 

    connectWalletButton.addEventListener('click', function() {
        if (window.ethereum) {
            ethereum.request({ method: 'eth_requestAccounts' })
            .then(function(accounts) {
                web3 = new Web3(window.ethereum);
                currentAccount = accounts[0];
                connectWalletButton.style.display = 'none';
                disconnectWalletButton.style.display = 'block';
                referenceText.style.display = 'none';
                walletAddressText.innerText = `Connected wallet: ${currentAccount}`;
                updateBalance(currentAccount);
                fetchTransactions(currentAccount);
            })
            .catch(function(error) {
                console.error('Error connecting to wallet:', error);
            });
        } else {
            alert('Please install MetaMask!');
        }
    });

    disconnectWalletButton.addEventListener('click', function() {
        connectWalletButton.style.display = 'block';
        disconnectWalletButton.style.display = 'none';
        referenceText.style.display = 'block';
        walletAddressText.innerText = 'Connected wallet: Not connected';
        ethBalanceDisplay.innerText = 'ETH Balance: -';
        document.getElementById('transactionsList').innerHTML = '';
    });

    async function updateBalance(address) {
        if (!web3) web3 = new Web3(window.ethereum);
        try {
            const balanceWei = await web3.eth.getBalance(address);
            const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
            ethBalanceDisplay.innerText = `ETH Balance: ${balanceEther}`;
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    }

    function fetchTransactions(address) {
        const apiKey = 'HXIMKKIW23DJ7V6VV9T7F2ZZMI7RBNADQC';
        const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
        fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === "1" && data.message === "OK") {
                displayTransactions(data.result, address);
            } else {
                console.error('Error fetching transaction data:', data);
            }
        })
        .catch(console.error);
    }

    function displayTransactions(transactions, account) {
        const transactionsList = document.getElementById('transactionsList');
        transactionsList.innerHTML = '';
        transactions.forEach(tx => {
            const card = document.createElement('div');
            card.className = 'transaction-card';
            const date = new Date(tx.timeStamp * 1000);
            const dateString = date.toLocaleString();
            const isIncoming = tx.to.toLowerCase() === account.toLowerCase();
            const iconSpan = document.createElement('span');
            iconSpan.className = `transaction-icon ${isIncoming ? 'icon-incoming' : 'icon-outgoing'}`;
            card.innerHTML = `
                <div class="transaction-header">Date: ${dateString}</div>
                <div class="transaction-row">
                    <span class="transaction-hash">${tx.hash}</span>
                    ${iconSpan.outerHTML}
                </div>
                <div class="transaction-row">From: ${tx.from}</div>
                <div class="transaction-row">To: ${tx.to}</div>
                <div class="transaction-row transaction-value">Value: ${web3.utils.fromWei(tx.value, 'ether')} ETH</div>
            `;
            transactionsList.appendChild(card);
        });
    }
});
