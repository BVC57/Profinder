import React, { createContext, useContext, useState } from 'react';

const PaymentHistoryContext = createContext();

export const usePaymentHistory = () => {
  const context = useContext(PaymentHistoryContext);
  if (!context) {
    throw new Error('usePaymentHistory must be used within a PaymentHistoryProvider');
  }
  return context;
};

export const PaymentHistoryProvider = ({ children }) => {
  const [paymentHistory, setPaymentHistory] = useState([]);

  const addPaymentRecord = (record) => {
    setPaymentHistory(prev => [record, ...prev]);
  };

  const getPaymentHistory = () => {
    return paymentHistory;
  };

  const clearPaymentHistory = () => {
    setPaymentHistory([]);
  };

  const value = {
    paymentHistory,
    addPaymentRecord,
    getPaymentHistory,
    clearPaymentHistory,
  };
  return (
    <PaymentHistoryContext.Provider value={value}>
      {children}
    </PaymentHistoryContext.Provider>
  );
};

