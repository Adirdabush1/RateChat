import React, { useEffect, useState } from 'react';
import axios from 'axios';
interface Message {
  content: string;
  sentiment: string;
  createdAt: string;
}

interface Message {
  content: string;
  sentiment: string;
  createdAt: string;
}

interface StudentData {
  name: string;            // צריך להיות name, לא childName
  score: number;
  flaggedMessages: Message[];
}


const ParentDashboard: React.FC = () => {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // פונקציה לקבלת נתוני הילד מהשרת
  const fetchStudentData = async () => {
  try {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem('parentToken');
    console.log('token:', token);

    const res = await axios.get<StudentData>('http://localhost:3000/parent/student-info', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Data received from server:', res.data);
    setStudent(res.data);
  } catch (err) {
    console.error('Error fetching data:', err);
    setError('אירעה שגיאה בטעינת הנתונים. נסה שוב מאוחר יותר.');
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchStudentData();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-10 text-xl">⏳ טוען מידע...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600">
        <p>{error}</p>
        <button
          onClick={fetchStudentData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          נסה שוב
        </button>
      </div>
    );
  }

  if (!student) {
    return <div className="text-center mt-10">לא נמצא מידע על הילד.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      <h1 className="text-3xl font-bold mb-4">👋 שלום {student.name}</h1>

      <div className="bg-green-100 p-4 rounded shadow mb-6">
        <p className="text-xl">
          💯 ניקוד כללי של הילד: <strong>{student.score}</strong>
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-2">🚨 הודעות חריגות</h2>

      {student.flaggedMessages && student.flaggedMessages.length === 0 ? (
        <p className="text-gray-700">אין הודעות חריגות.</p>
      ) : (
        <ul className="space-y-3">
          {student.flaggedMessages?.map((msg, index) => (
            <li key={index} className="bg-red-100 p-4 rounded shadow">
              <p><strong>תוכן:</strong> {msg.content}</p>
              <p><strong>מצב רוח:</strong> {msg.sentiment}</p>
              <p className="text-sm text-gray-600">
                🕒 {new Date(msg.createdAt).toLocaleString('he-IL', {
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
