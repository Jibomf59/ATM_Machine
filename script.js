let currentUser = {
    pin: '1234',
    balance: 5000,
    transactions: []
};

let currentInput = '';
let currentScreen = 'login';
let currentTransactionType = '';

function handleInput(value) {
    if (value === 'C') {
        currentInput = '';
        updateDisplay();
        return;
    }

    if (value === 'Enter') {
        processInput();
        return;
    }

    if (currentInput.length < 10) {
        currentInput += value;
        updateDisplay();
    }
}

function updateDisplay() {
    if (currentScreen === 'login') {
        document.getElementById('pinDisplay').textContent = 
            currentInput.replace(/./g, '*').padEnd(4, '_');
    } else if (currentScreen === 'mainMenu') {
        const selectionDisplay = document.getElementById('menuSelectionDisplay');
        if (selectionDisplay) {
            selectionDisplay.textContent = `Selected: ${currentInput}`;
        }
    }
}

function processInput() {
    switch(currentScreen) {
        case 'login':
            if (currentInput === currentUser.pin) {
                currentScreen = 'mainMenu';
                showMainMenu();
            } else {
                alert('Invalid PIN!');
                currentInput = '';
                updateDisplay();
            }
            break;

        case 'mainMenu':
            handleMenuSelection(currentInput);
            break;

        case 'transaction':
            handleTransaction(currentInput);
            break;
    }
    currentInput = '';
    updateDisplay();
}

function showMainMenu() {
    document.getElementById('loginScreen').classList.add('hidden');
    const mainMenu = document.getElementById('mainMenu');
    mainMenu.classList.remove('hidden');

    // Add clear instructions and selection display
    mainMenu.innerHTML = `
        <h2>Main Menu</h2>
        <p>1. Balance Inquiry</p>
        <p>2. Cash Withdrawal</p>
        <p>3. Deposit Funds</p>
        <p>4. Transfer Funds</p>
        <p>5. Exit</p>
        <p style="margin-top:10px; color:#333;">Enter selection number and press Enter</p>
        <p id="menuSelectionDisplay">Selected: </p>
    `;
}

function handleMenuSelection(choice) {
    const transactionScreen = document.getElementById('transactionScreen');
    transactionScreen.classList.remove('hidden');
    document.getElementById('mainMenu').classList.add('hidden');
    currentScreen = 'transaction';

    switch(choice) {
        case '1':
            transactionScreen.innerHTML = `
                <h2>Balance Inquiry</h2>
                <p>Current Balance: $${currentUser.balance}</p>
                <p>Press Enter to return</p>
            `;
            currentTransactionType = 'balance';
            break;

        case '2':
            transactionScreen.innerHTML = `
                <h2>Cash Withdrawal</h2>
                <p>Enter amount:</p>
            `;
            currentTransactionType = 'withdraw';
            break;

        case '3':
            transactionScreen.innerHTML = `
                <h2>Deposit Funds</h2>
                <p>Enter amount:</p>
            `;
            currentTransactionType = 'deposit';
            break;

        case '4':
            transactionScreen.innerHTML = `
                <h2>Transfer Funds</h2>
                <p>Enter account number:</p>
            `;
            currentTransactionType = 'transferAccount';
            break;

        case '5':
            currentScreen = 'login';
            document.getElementById('loginScreen').classList.remove('hidden');
            document.getElementById('mainMenu').classList.add('hidden');
            transactionScreen.classList.add('hidden');
            break;

        default:
            alert('Invalid selection!');
            currentScreen = 'mainMenu';
            showMainMenu();
            break;
    }
}

function handleTransaction(input) {
    const transactionScreen = document.getElementById('transactionScreen');

    switch(currentTransactionType) {
        case 'withdraw':
            const amount = parseInt(input);
            if (isNaN(amount) || amount <= 0) {
                alert('Invalid amount!');
            } else if (amount > currentUser.balance) {
                alert('Insufficient funds!');
            } else {
                currentUser.balance -= amount;
                addTransaction(`Withdrawal: -$${amount}`);
                showTransactionResult(`Success! New balance: $${currentUser.balance}`);
            }
            break;

        case 'deposit':
            const depositAmount = parseInt(input);
            if (isNaN(depositAmount) || depositAmount <= 0) {
                alert('Invalid amount!');
            } else {
                currentUser.balance += depositAmount;
                addTransaction(`Deposit: +$${depositAmount}`);
                showTransactionResult(`Success! New balance: $${currentUser.balance}`);
            }
            break;

        case 'transferAccount':
            if (input.length === 4) {
                currentTransactionType = 'transferAmount';
                transactionScreen.innerHTML = `
                    <h2>Transfer Funds</h2>
                    <p>Enter amount:</p>
                `;
            } else {
                alert('Account number must be 4 digits!');
            }
            break;

        case 'transferAmount':
            const transferAmount = parseInt(input);
            if (isNaN(transferAmount) || transferAmount <= 0) {
                alert('Invalid amount!');
            } else if (transferAmount > currentUser.balance) {
                alert('Insufficient funds!');
            } else {
                currentUser.balance -= transferAmount;
                addTransaction(`Transfer: -$${transferAmount}`);
                showTransactionResult(`Transfer successful! New balance: $${currentUser.balance}`);
            }
            break;

        case 'balance':
            currentScreen = 'mainMenu';
            transactionScreen.classList.add('hidden');
            showMainMenu();
            break;
    }
}

function showTransactionResult(message) {
    const transactionScreen = document.getElementById('transactionScreen');
    transactionScreen.innerHTML = `
        <h2>Transaction Complete</h2>
        <p>${message}</p>
        <p>Press Enter to return</p>
    `;
    currentTransactionType = 'balance';
}

function addTransaction(description) {
    currentUser.transactions.push({
        date: new Date().toLocaleString(),
        description: description,
        balance: currentUser.balance
    });
}
