import { createContext, useContext, useState, useEffect } from 'react';

const SocketContext = createContext();

export const SocketProvider = ({children, socket}) => {
  const [providerValue, setProviderValue] = useState({
    prompt: [],
    story: [],
    responses: {},
    endTime: 0,
    socket
  });

  useEffect(() => {
    socket.on('new prompt', (data) => {
      console.log(data);
      setProviderValue(prevState => {
        return {
          ...prevState,
          prompt: data.words,
          responses: {}
        }
      });
    });

    socket.on('sync prompt', (data) => {
      console.log(data);
      setProviderValue(prevState => {
        return {
          ...prevState,
          prompt: data.words,
          responses: data.responses
        }
      });
    });

    socket.on('new post', (responseId, responseObject) => {
      console.log(`received message from ${responseObject.username} that says ${responseObject.text}`);
      setProviderValue(prevState => {
        return {
          ...prevState,
          responses: {
            ...prevState.responses,
            [responseId]: responseObject
          }
        }
      })
    });

    socket.on('round end', (data) => {
      // clear round-specific state data
      // rethinking this - it's causing a flicker
      // setProviderValue(prevState => {
      //   return {
      //     ...providerValue,
      //     prompt: [],
      //     story: [],
      //     responses: {},
      //     endTime: 0,
      //   }
      // });
    });

    // cleanup function... just in case
    // I'm not sure this is necessary for an empty dependency list
    return () => {
      socket.removeAllListeners('new prompt');
      socket.removeAllListeners('sync prompt');
      socket.removeAllListeners('new post');
      socket.removeAllListeners('round end');
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
