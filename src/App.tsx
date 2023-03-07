import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useMirPayBluetooth} from "./MirPayBluetooth";

function App() {
  const { connect, processTransaction, isConnected, transactionData } = useMirPayBluetooth();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <p>
          {isConnected ? (
              <button onClick={processTransaction}>Process Transaction</button>
          ) : (
              <button onClick={connect}>Connect</button>
          )}
        </p>

        <p className="WrappedText">{transactionData}</p>

      </header>
    </div>
  );
}

export default App;
