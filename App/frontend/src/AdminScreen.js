import React, { useEffect, useState } from 'react';
import './AccountScreen.css'; // Reuse styles for minimalist look
import {
  fetchSupplierApplications,
  approveSupplier,
  rejectSupplier,
  fetchUsers,
  flagUser,
  changeUserRole,
  fetchMessagesAdmin,
  flagMessage
} from './api';

const AdminScreen = () => {
  // Tabs: suppliers, users, messages
  const [tab, setTab] = useState('suppliers');

  // Supplier applications
  const [applications, setApplications] = useState([]);
  const [appLoading, setAppLoading] = useState(false);
  const [appError, setAppError] = useState('');

  // Users
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState('');

  // Messages
  const [messages, setMessages] = useState([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgError, setMsgError] = useState('');

  // Fetch data on tab change
  useEffect(() => {
    if (tab === 'suppliers') {
      setAppLoading(true);
      fetchSupplierApplications('pending')
        .then(data => {
          setApplications(data.applications || []);
          setAppLoading(false);
        })
        .catch(() => {
          setAppError('Could not load supplier applications');
          setAppLoading(false);
        });
    } else if (tab === 'users') {
      setUserLoading(true);
      fetchUsers()
        .then(data => {
          setUsers(data.users || []);
          setUserLoading(false);
        })
        .catch(() => {
          setUserError('Could not load users');
          setUserLoading(false);
        });
    } else if (tab === 'messages') {
      setMsgLoading(true);
      fetchMessagesAdmin()
        .then(data => {
          setMessages(data.messages || []);
          setMsgLoading(false);
        })
        .catch(() => {
          setMsgError('Could not load messages');
          setMsgLoading(false);
        });
    }
  }, [tab]);

  // Handlers
  const handleApprove = id => {
    approveSupplier(id).then(() => {
      setApplications(applications.filter(a => a.id !== id));
    });
  };
  const handleReject = (id) => {
    const reason = prompt('Reason for rejection?');
    if (!reason) return;
    rejectSupplier(id, reason).then(() => {
      setApplications(applications.filter(a => a.id !== id));
    });
  };
  const handleFlagUser = id => {
    flagUser(id).then(() => {
      setUsers(users.map(u => u.id === id ? { ...u, flagged: true } : u));
    });
  };
  const handleChangeRole = (id) => {
    const role = prompt('Enter new role (admin, supplier, buyer):');
    if (!role) return;
    changeUserRole(id, role).then(() => {
      setUsers(users.map(u => u.id === id ? { ...u, role } : u));
    });
  };
  const handleFlagMessage = id => {
    flagMessage(id).then(() => {
      setMessages(messages.map(m => m.id === id ? { ...m, flagged: true } : m));
    });
  };

  return (
    <div className="account-container">
      <div className="account-header">
        <h2>Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button className={tab === 'suppliers' ? 'account-menu-item active' : 'account-menu-item'} onClick={() => setTab('suppliers')}>Suppliers</button>
          <button className={tab === 'users' ? 'account-menu-item active' : 'account-menu-item'} onClick={() => setTab('users')}>Users</button>
          <button className={tab === 'messages' ? 'account-menu-item active' : 'account-menu-item'} onClick={() => setTab('messages')}>Messages</button>
        </div>
      </div>
      <div className="account-notification-container">
        {tab === 'suppliers' && (
          <div>
            {appLoading && <div>Loading...</div>}
            {appError && <div>{appError}</div>}
            {applications.map(app => (
              <div className="account-notification-card" key={app.id}>
                <div>
                  <b>{app.business_name}</b> (User: {app.user_id})<br />
                  Status: {app.status}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleApprove(app.id)} className="button-red">Approve</button>
                  <button onClick={() => handleReject(app.id)} className="button-red outline">Reject</button>
                </div>
              </div>
            ))}
            {applications.length === 0 && !appLoading && <div>No pending applications.</div>}
          </div>
        )}
        {tab === 'users' && (
          <div>
            {userLoading && <div>Loading...</div>}
            {userError && <div>{userError}</div>}
            {users.map(user => (
              <div className="account-notification-card" key={user.id}>
                <div>
                  <b>{user.email}</b> (Role: {user.role}) {user.flagged && <span style={{ color: 'red' }}>[Flagged]</span>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleFlagUser(user.id)} className="button-red outline">Flag</button>
                  <button onClick={() => handleChangeRole(user.id)} className="button-red">Change Role</button>
                </div>
              </div>
            ))}
            {users.length === 0 && !userLoading && <div>No users found.</div>}
          </div>
        )}
        {tab === 'messages' && (
          <div>
            {msgLoading && <div>Loading...</div>}
            {msgError && <div>{msgError}</div>}
            {messages.map(msg => (
              <div className="account-notification-card" key={msg.id}>
                <div>
                  <b>From:</b> {msg.sender_id} <b>To:</b> {msg.receiver_id}<br />
                  {msg.content}
                  {msg.flagged && <span style={{ color: 'red' }}> [Flagged]</span>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleFlagMessage(msg.id)} className="button-red outline">Flag</button>
                </div>
              </div>
            ))}
            {messages.length === 0 && !msgLoading && <div>No messages found.</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminScreen;
