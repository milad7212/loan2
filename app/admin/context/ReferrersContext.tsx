"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Referrer {
  id: string;
  name: string;
  phone?: string;
  nationalId?: string;
}

interface ReferrersContextType {
  referrers: Referrer[];
  setReferrers: React.Dispatch<React.SetStateAction<Referrer[]>>;
  addReferrer: (referrer: Omit<Referrer, 'id'>) => void;
}

const ReferrersContext = createContext<ReferrersContextType | undefined>(undefined);

export const ReferrersProvider = ({ children }: { children: ReactNode }) => {
  const [referrers, setReferrers] = useState<Referrer[]>([
    { id: "1", name: "حسن کریمی", phone: "09121111111", nationalId: "1111111111" },
    { id: "2", name: "مریم رضایی", phone: "09122222222", nationalId: "2222222222" },
    { id: "3", name: "علی جعفری", phone: "09123333333", nationalId: "3333333333" },
  ]);

  const addReferrer = (referrerData: Omit<Referrer, 'id'>) => {
    const newReferrer: Referrer = {
      id: Date.now().toString(),
      ...referrerData,
    };
    setReferrers((prevReferrers) => [...prevReferrers, newReferrer]);
  };

  return (
    <ReferrersContext.Provider value={{ referrers, setReferrers, addReferrer }}>
      {children}
    </ReferrersContext.Provider>
  );
};

export const useReferrers = () => {
  const context = useContext(ReferrersContext);
  if (context === undefined) {
    throw new Error('useReferrers must be used within a ReferrersProvider');
  }
  return context;
};
