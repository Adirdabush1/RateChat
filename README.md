# 📱 **RateChat**

**RateChat** is a smart digital messaging platform, inspired by the familiar look and feel of **WhatsApp**, but designed specifically for **educational institutions**, **youth communities**, and **organizations** that seek to promote **respectful and safe communication**.

The system uses **AI-powered tools** to analyze the tone of messages, **rate them by mood**, **score users by the quality of their speech**, and automatically **alert educators or parents** when harmful or inappropriate content is detected.

---

## 🚀 **Main Features**

- ✅ **Secure registration and login system** (JWT + Bcrypt)  
- 💬 **Create chat groups or private conversations**  
- 🧠 **Real-time AI message analysis**  
- 📊 **User scoring based on message quality**  
- 🚨 **Automatic alerts for flagged content**  
- 📦 **Data stored securely in MongoDB**  
- 🌐 **Responsive design for mobile devices**

---

## 🛠 **Tech Stack**

**Frontend:**  
- **React + TypeScript**  
- **React Router**  
- **CSS Modules**

**Backend:**  
- **Node.js + Express**  
- **TypeScript**  
- **MongoDB (Mongoose)**  
- **JWT + Bcrypt**

**Other Tools:**  
- **OpenAI API for message analysis**  
- **Render for deployment**  
- **GitHub for version control**

---

## ⚙️ **Local Setup**

### **Prerequisites:**
- **Node.js + NPM**  
- **MongoDB (local or cloud)**

### **Steps:**

1. **Clone the repo:**
```bash
git clone https://github.com/Adirdabush1/RateChat.git
cd RateChat
```

2. **Install dependencies:**
```bash
# Backend:
cd student-chat-app/server
npm install

# Frontend:
cd ../../client/student-client-app
npm install
```

3. **Create environment files:**

**Backend (`student-chat-app/server/.env`):**
```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

**Frontend (`client/student-client-app/.env`):**
```env
REACT_APP_SERVER_URL=http://localhost:5000
```

4. **Run the development servers:**
```bash
# Terminal 1 – Backend:
cd student-chat-app/server
npm run dev

# Terminal 2 – Frontend:
cd client/student-client-app
npm start
```

---

## 🧪 **Planned Features**

- 🔔 **Real-time alerting to staff/parents**  
- 🧑‍🏫 **Dashboard for teachers and admins**  
- 📱 **PWA (Progressive Web App) version**  
- 🧩 **Integration with school management systems (LMS)**

---

## 🤝 **Contributing**

1. **Fork the repo**  
2. **Create a feature branch:** `feature/yourFeature`  
3. **Submit a Pull Request**

---

## 👨‍💻 **Developer**

**Adir Dabush**  
**Software Engineering Student | Intern at AnyApp**  
[**GitHub: @Adirdabush1**](https://github.com/Adirdabush1)

---

## 📄 **License**

**RateChat is an open-source project under the MIT License.**

images:

![image](https://github.com/user-attachments/assets/98b696bf-50f3-4e3c-af27-a86fa8f56eca)

![image](https://github.com/user-attachments/assets/60b5dd62-2281-4a36-bcda-ee28c98f5f8b)

![image](https://github.com/user-attachments/assets/647668da-96ca-4618-b6d4-ef8ea250719e)

![image](https://github.com/user-attachments/assets/1b479758-2efc-48de-982e-577f8002f523)


