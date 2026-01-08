import { createContext, useContext, useState, useEffect } from 'react';

const SocketContext = createContext();

export const SocketProvider = ({children, socket}) => {
  const [providerValue, setProviderValue] = useState({
    prompt: [],
    story: [],
    responses: [],
    endTime: 0,
    socket
  });

  useEffect(() => {
    socket.on('new prompt', (data) => {
      console.log(data);
      setProviderValue({
        ...providerValue,
        prompt: data
      });
    });

    // cleanup function... just in case
    // I'm not sure this is necessary for an empty dependency list
    return () => {
      socket.removeAllListeners('new prompt');
    };
  }, []);

  return (
    <SocketContext.Provider value={providerValue}>
      {children}
    </SocketContext.Provider>
  );

};

export const useSocket = () => {
  return useContext(SocketContext);
};
