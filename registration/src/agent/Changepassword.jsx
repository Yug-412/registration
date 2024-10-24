import React, { useState } from 'react';

const ChangePassword = ({ isOpen, onClose, onSubmit }) => {
  const [newPassword, setNewPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newPassword, password, confirmPassword);
    setNewPassword('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      {isOpen &&
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={onClose}>&times;</span>
            <form onSubmit={handleSubmit}>
              <label>New Password:</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              <label>Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <label>Confirm Password:</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      }
    </>
  );
};

export default ChangePassword;
