import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(import.meta.dirname + "/views/index.html");
});

// Do not change code above this line
app.get("/api{/:date}", (req, res) => {
  const { date } = req.params;

  // Empty parameter returns the current time
  if (date === undefined) {
    const now = new Date();
    return res.json({ unix: now.getTime(), utc: now.toUTCString() });
  }

  // A string of only digits is a Unix timestamp in milliseconds
  const parsed = /^-?\d+$/.test(date) ? new Date(Number(date)) : new Date(date);

  // Invalid input
  if (isNaN(parsed.getTime())) {
    return res.json({ error: "Invalid Date" });
  }

  // Valid input
  res.json({ unix: parsed.getTime(), utc: parsed.toUTCString() });
});
// Do not change code below this line

const PORT = 8000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
