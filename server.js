//JShintESversion:6
const express = require("express");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());

app.post("/extract-text", (req, res) => {
    if (!req.files || !req.files.pdfFile) {
      return res.status(400).send({ error: "Nothing Yet!" });
    }
    const pdfFile = req.files.pdfFile;
  
    pdfParse(pdfFile.data)
      .then((result) => {
        const text = result.text;
        //console.log("Extracted Text:", text); -> Debugged!
        const nameMatch = text.match(/Name[:\s]+(.+)/i);
        const phoneMatch = text.match(/Phone[:\s]+(.+)/i);
        const addressMatch = text.match(/Address[:\s]+([\s\S]*?)(?=\n|$)/i);
  
        const extractedData = {
          name: nameMatch ? nameMatch[1].trim() : '',
          phone_number: phoneMatch ? phoneMatch[1].trim() : '',
          address: addressMatch ? addressMatch[1].trim() : ''
        };
  
        res.json(extractedData);
      })
      .catch((error) => {
        console.error("Parsing went wrong!", error);
        res.status(500).send({ error: "Processing went wrong!" });
      });
  });
  
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
