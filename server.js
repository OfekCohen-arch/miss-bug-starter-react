import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { bugService } from "./services/bug.service.js";
import { loggerService } from "./services/logger.service.js";


const app = express();
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.set("query parser", "extended");

app.get("/api/bug", (req, res) => {
  const filterBy = {
    txt: req.query.txt,
    minSeverity: +req.query.minSeverity,
    paginationOn: req.query.paginationOn === 'true',
    pageIdx: req.query.pageIdx
  };
  bugService.query(filterBy).then((bugs) => res.send(bugs));
});
app.get("/api/bug/:bugId", (req, res) => {
  const bugId = req.params.bugId;
  const visitedBugsIds = req.cookies.visitedBugsIds || [];
  if(visitedBugsIds.includes(bugId)) visitedBugsIds.push(bugId)
  if(visitedBugsIds.length>3) return res.status(401).send("Wait for a bit");
  res.cookie('visitedBugsIds',visitedBugsIds,{maxAge: 7000})
  bugService.getById(bugId)
    .then((bug) => {
      res.send(bug)
    })
    .catch((err) => {
      loggerService.error(err);
      res.status(404).send(err);
    });
});

app.put("/api/bug/:id", (req, res) => {
  const { _id, title, description, severity, createdAt } = req.body;
  const bug = { _id, title, description, severity, createdAt };
  bugService.save(bug).then((bug) => res.send(bug));
});
app.post("/api/bug", (req, res) => {
  const {title, description, severity, createdAt } = req.body;
  const bug = {title, description, severity, createdAt };
  bugService.save(bug).then((bug) => res.send(bug));
});


app.delete("/api/bug/:bugId", (req, res) => {
  const bugId = req.params.bugId;
  bugService.remove(bugId)
  .then(res.send("OK"))
  .catch(err => {
			loggerService.error(err)
			res.status(404).send(err)
		})
});

app.get('/*all', (req, res) => {
	res.sendFile(path.resolve('public/index.html'))
})

const port = 3030;
app.listen(port);
