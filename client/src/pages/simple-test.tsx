export default function SimpleTest() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Simple Test Page</h1>
      <p>This page confirms the server is working correctly.</p>
      <div>
        <button 
          style={{ 
            padding: '10px 20px', 
            background: 'blue', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => {
            alert('Button clicked successfully!');
          }}
        >
          Click Me
        </button>
      </div>
    </div>
  );
}