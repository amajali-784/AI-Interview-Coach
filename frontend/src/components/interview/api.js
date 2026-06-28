import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await axios.post(`${API_BASE_URL}/resume/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const saveInterviewData = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/resume/save`, data);
  return response.data;
};
export class WebSocketService {
  constructor() {
      this.socket = null;
  }

  connect() {
      this.socket = new WebSocket('ws://localhost:8000/ws/interview');
      
      this.socket.onopen = () => {
          console.log('WebSocket Connected');
      };

      this.socket.onmessage = (message) => {
          const data = JSON.parse(message.data);
          if (data.type === 'text_to_speech') {
              // Handle text-to-speech audio for the 3D model
              console.log('Received question audio:', data.audio);
          }
      };

      this.socket.onerror = (error) => {
          console.error('WebSocket Error:', error);
      };

      this.socket.onclose = () => {
          console.log('WebSocket Disconnected');
      };
  }

  onMessage(callback) {
      this.socket.onmessage = (message) => {
          callback(JSON.parse(message.data));
      };
  }

  sendAnswer(answer) {
      const data = {
          type: 'user_answer',
          answer: answer
      };
      this.socket.send(JSON.stringify(data));
  }

  close() {
      this.socket.close();
  }
}
