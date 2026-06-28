const validateFile = (req, res, next) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
  
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type' });
    }
    next();
  };
  
  module.exports = { validateFile };
  