import React, { useState } from 'react';
import EmailForm from './components/EmailForm';

function App() {
  const [emails, setEmails] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSendEmails = () => {
    // Simulate sending emails (replace with actual logic)
    console.log(`Sending emails to ${emails.length} recipients...`);
    console.log('Subject:', subject);
    console.log('Message:', message);
  };

  return (
    <div className="min-h-full bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
        <h2 className="text-2xl font-bold text-blue-500 mb-4">Bulk Mail</h2>
        <p className="text-gray-700 mb-4">We can help your business with sending multiple emails at once.</p>
        <EmailForm
          emails={emails}
          setEmails={setEmails}
          subject={subject}
          setSubject={setSubject}
          message={message}
          setMessage={setMessage}
          onSend={handleSendEmails}
        />
      </div>
    </div>
  );
}

export default App;
