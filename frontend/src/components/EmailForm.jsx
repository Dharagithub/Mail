import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; 

const EmailForm = () => {
  const [emails, setEmails] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  //const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); 

  
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    //setFile(uploadedFile);
    console.log('Uploaded file:', uploadedFile);

    if (uploadedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0]; 
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const emailList = data.map(row => row[0]).filter(email => email); 
        setEmails(emailList);
      };

      reader.readAsBinaryString(uploadedFile);
    }
  };

  
  const handleSend = async () => {
    setLoading(true); 
    try {
      const response = await axios.post('http://localhost:5000/sendmail', {
        emails,
        subject,
        message,
      });
      alert(response.data);
    } catch (error) {
      console.error('Error sending emails:', error);
      alert('Error sending emails');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div>      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500"
          placeholder="Enter the email text..."
          rows="4"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload the File:</label>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-gray-50 focus:outline-none focus:border-blue-500"
        />
      </div>

      <p className="font-medium text-gray-700 mb-4">Number of Emails in the file: {emails.length}</p>
      <button
        onClick={handleSend}
        className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold ${loading ? 'bg-blue-400 cursor-wait' : ''}`}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
};

export default EmailForm;
