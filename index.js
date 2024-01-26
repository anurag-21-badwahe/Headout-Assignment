const express = require('express');
const fs = require('fs').promises;
const app = express();
const port = 8080;

app.get('/data', async (req, res) => {
  try {
    // Extract query parameters
    const n = req.query.n;
    const m = req.query.m;

    // Validate the presence of the 'n' parameter
    if (!n) {
      return res.status(400).json({ error: "Parameter 'n' is required." });
    }

    // Construct file path
    const filePath = `/tmp/data/${n}.txt`; 

    // Read file content based on the presence of 'm'
    if (m) {
      const lineNumber = parseInt(m);
      // Read specific line if 'm' is provided
      const content = await readLineFromFile(filePath, lineNumber);
      res.send(content);
    } else {
      // Read the entire file if only 'n' is provided
      const content = await readFile(filePath);
      res.send(content);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function readFile(filePath) {
  // Read the entire file
  const content = await fs.readFile(filePath, 'utf-8');
  return content;
}

async function readLineFromFile(filePath, lineNumber) {
  // Read specific line from the file
  const content = await fs.readFile(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // Ensure line number is within bounds
  if (lineNumber <= 0 || lineNumber > lines.length) {
    throw new Error(`Invalid line number: ${lineNumber}`);
  }

  return lines[lineNumber - 1];
}
//
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
