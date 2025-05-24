import React from 'react';
import './WalletScreen.css';
import { fetchWallet } from './api';

const WalletScreen = () => {
  const [balance, setBalance] = React.useState(null);
  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Replace 'userId' with actual user id from context or props
    const userId = 'demo-user';
    fetchWallet(userId)
      .then(data => {
        setBalance(data.balance);
        setTransactions(data.transactions);
        setLoading(false);
      })
      .catch(err => {
        setError('Could not load wallet');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="wallet-container">Loading...</div>;
  if (error) return <div className="wallet-container">{error}</div>;

  return (
    <div className="wallet-container">
      <div className="balance-card">
        <div className="balance-label">Current Balance</div>
        <div className="balance-amount">₦{Number(balance).toLocaleString(undefined, {minimumFractionDigits:2})}</div>
      </div>
      <div className="wallet-actions">
        <button className="button-red">Top Up</button>
        <button className="button-red outline">Withdraw</button>
      </div>
      <div className="transactions-section">
        <div className="transactions-title">Recent Transactions</div>
        <div className="transactions-list">
          {transactions.length === 0 && <div>No transactions yet.</div>}
          {transactions.map(tx => (
            <div className="transaction-item" key={tx.id}>
              <span className={`tx-icon ${tx.type}`}>{tx.type === 'in' ? '↓' : '↑'}</span>
              <div className="tx-details">
                <div className="tx-desc">{tx.description}</div>
                <div className="tx-date">{tx.date}</div>
              </div>
              <div className={`tx-amount ${tx.type}`}>{tx.amount > 0 ? `+₦${tx.amount.toLocaleString(undefined, {minimumFractionDigits:2})}` : `-₦${Math.abs(tx.amount).toLocaleString(undefined, {minimumFractionDigits:2})}`}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletScreen;
