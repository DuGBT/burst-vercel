// MyContext.js
import { createContext, useState } from "react";

const MyContext = createContext();

const MyContextProvider = ({ children }) => {
  const [contextValue, setContextValue] = useState({ burstLockCount: 0 });

  const updateContextValue = (obj) => {
    Object.entries(obj).forEach(([key, value]) => {
      setContextValue((prevValue) => {
        return { ...prevValue, [key]: value };
      });
    });
  };

  return (
    <MyContext.Provider value={{ contextValue, updateContextValue }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyContextProvider };
