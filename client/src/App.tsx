// Super simple App component with no dependencies

function App() {
  // Create a very simple component with no dependencies
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto',
      textAlign: 'center' 
    }}>
      <h1 style={{ color: '#00539f' }}>Tesco Price Comparison</h1>
      <p>Welcome to the Tesco Price Comparison Tool</p>
      <p>This is a minimal app with no external dependencies</p>
      
      <div style={{ 
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '20px',
        backgroundColor: '#f8f8f8' 
      }}>
        <h2>Application Status</h2>
        <p>
          Basic React rendering is working if you can see this message.
        </p>
        <p>
          Current Time: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

export default App;
