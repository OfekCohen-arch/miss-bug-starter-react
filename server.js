import express from "express";
import cookieParser from "cookie-parser";
import { bugService } from "./services/bug.service.js";

const app = express();
app.use(express.static("public"));
app.use(cookieParser());
app.set("query parser", "extended");

app.get("/", (req, res) => res.send("Hello there"));
app.get("/api/bug", (req, res) => {
  const filterBy = {
    txt: req.query.txt,
    minSeverity: +req.query.minSeverity,
  };
  bugService.query(filterBy).then((bugs) => res.send(bugs));
});
app.get("/api/bug/save", (req, res) => {
  const { _id, title, description, severity, createdAt } = req.query;
  const bug = { _id, title, description, severity, createdAt };
  console.log(bug);

  bugService.save(bug).then((bug) => res.send(bug));
});
app.get("/api/bug/:bugId", (req, res) => {
  const bugId = req.params.bugId;
  const visitedBugsIds = req.cookies.visitedBugsIds || [];
  const idx = visitedBugsIds.findIndex((currId) => currId === bugId);
  bugService.getById(bugId).then((bug) => {
    if (idx === -1 && visitedBugsIds.length < 3) {
      visitedBugsIds.push(bugId);
      res.cookie("visitedBugsIds", visitedBugsIds, { maxAge: 7_000 });
      res.send(bug);
    }
    else if (idx > -1) res.send(bug);
    else  res.status(401).send("Wait for a bit");
  });
});
app.get("/api/bug/:bugId/remove", (req, res) => {
  const bugId = req.params.bugId;
  bugService.remove(bugId).then(res.send("OK"));
});
const port = 3030;
app.listen(port);
