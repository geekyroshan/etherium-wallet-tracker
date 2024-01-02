let web3;
document.addEventListener('DOMContentLoaded', function () {
    const connectWalletButton = document.getElementById('connectWallet');

    connectWalletButton.addEventListener('click', function() {
        if (typeof window.ethereum !== 'undefined') {
            ethereum.request({ method: 'eth_requestAccounts' })
                .then(function(accounts) {
                    // Initialize web3 with the current provider
                    web3 = new Web3(ethereum);
                    document.getElementById('walletAddress').innerText = `Connected wallet: ${accounts[0]}`;
                    updateBalance(web3, accounts[0]);
                    fetchTransactions(web3, accounts[0]);
                })
                .catch(function(error) {
                    console.error('Error connecting to wallet:', error);
                });
        } else {
            alert('Please install MetaMask!');
        }
    });

    async function updateBalance(web3, address) {
        try {
            const balanceWei = await web3.eth.getBalance(address);
            const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
            document.getElementById('ethBalance').innerText = `ETH Balance: ${balanceEther}`;
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    }

    function fetchTransactions(web3, address) {
        const apiKey = 'HXIMKKIW23DJ7V6VV9T7F2ZZMI7RBNADQC';
        const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('API Response:', data); // Add this line to log the API response
                if(data.status === "1" && data.message === "OK") {
                    displayTransactions(data.result);
                } else {
                    console.error('Error fetching transaction data:', data);
                }
            })
            .catch(console.error);
        }
        function displayTransactions(transactions) {
            const transactionsList = document.getElementById('transactionsList');
            transactionsList.innerHTML = ''; 
        
            transactions.forEach(tx => {
                const date = new Date(tx.timeStamp * 1000);
                const dateString = date.toLocaleString(); // Converts to a readable date and time
        
                const li = document.createElement('li');
                li.textContent = `Date: ${dateString}, Hash: ${tx.hash}, From: ${tx.from}, To: ${tx.to}, Value: ${web3.utils.fromWei(tx.value, 'ether')} ETH`;
                transactionsList.appendChild(li);
            });
        }
        
});
