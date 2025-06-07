import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

interface Message {
  content: string;
  sentiment: string;
  createdAt: string;
}

interface StudentData {
  name: string;
  score: number;
  flaggedMessages: Message[];
}

const ParentDashboard: React.FC = () => {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);

  const fetchStudentData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('parentToken');
      console.log('Token from localStorage:', token);  // לוג הטוקן

      if (!token) throw new Error('No parent token found');

      const res = await axios.get<StudentData>('https://ratechat-1.onrender.com/parent/student-info', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Student data from server:', res.data);  // לוג התגובה מהשרת

      setStudent(res.data);
    } catch (err: any) {
      console.error('Error fetching student data:', err);  // לוג שגיאות
      setError(err.message || 'An error occurred while loading data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('parentToken');
    if (!token) {
      console.log('No token found, skipping socket connection');
      return;
    }

    const socket = io('https://ratechat-1.onrender.com', {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      if (student?.name) {
        console.log('Registering parent with name:', student.name);
        socket.emit('registerParent', student.name);
      }
    });

    socket.on('studentDataUpdate', (data: StudentData) => {
      console.log('Received student data update:', data);
      setStudent(data);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      socket.disconnect();
    };
  }, []); // ללא תלות ב-student?.name

  if (isLoading) {
    return <div className="text-center mt-10 text-xl">⏳ Loading data...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600">
        <p>{error}</p>
        <button
          onClick={fetchStudentData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!student) {
    return <div className="text-center mt-10">No student data found.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="ltr">
      <h1 className="text-3xl font-bold mb-4">👋 Hello {student.name}</h1>

      <div className="bg-green-100 p-4 rounded shadow mb-6">
        <p className="text-xl">
          💯 Overall Student Score: <strong>{student.score}</strong>
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-2">🚨 Flagged Messages</h2>

      {student.flaggedMessages && student.flaggedMessages.length === 0 ? (
        <p className="text-gray-700">No flagged messages.</p>
      ) : (
        <ul className="space-y-3">
          {student.flaggedMessages?.map((msg, index) => (
            <li key={index} className="bg-red-100 p-4 rounded shadow">
              <p><strong>Content:</strong> {msg.content}</p>
              <p><strong>Sentiment:</strong> {msg.sentiment}</p>
              <p className="text-sm text-gray-600">
                🕒 {new Date(msg.createdAt).toLocaleString('en-US', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ParentDashboard;
