const express = require('express');
const authRouter = require('./auth');

const app = express();
app.use(express.json());

app.use('/auth', authRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

