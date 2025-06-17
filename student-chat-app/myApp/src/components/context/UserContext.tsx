import React, { createContext, useContext } from 'react';

type User = { name: string; email: string } | null;

export const UserContext = createContext<User>(null);

export const useUser = (): User => useContext(UserContext);
