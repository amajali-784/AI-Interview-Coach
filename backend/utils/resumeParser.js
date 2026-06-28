const axios = require('axios');
const fs = require('fs').promises;

const parseResume = async (filePath) => {
  try {
    const fileData = await fs.readFile(filePath);
    const formData = new FormData();
    formData.append('resume', fileData, filePath);

    const response = await axios.post('http://ai-service:5000/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error) {
    throw new Error('Failed to parse resume');
  }
};

module.exports = { parseResume };
