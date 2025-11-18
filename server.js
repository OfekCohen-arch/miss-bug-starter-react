import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { bugService } from "./services/bug.service.js";
import { loggerService } from "./services/logger.service.js";
import { userService } from "./services/user.service.js";
import { authService } from "./services/auth.service.js";

const app = express();
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.set("query parser", "extended");

app.get("/api/bug", (req, res) => {
  const queryOptions = parseQueryParams(req.query);
  bugService.query(queryOptions).then((bugs) => res.send(bugs));
});
function parseQueryParams(queryParams) {
  const filterBy = {
    txt: queryParams.txt || "",
    minSeverity: +queryParams.minSeverity || 0,
    labels: queryParams.labels || [],
    paginationOn: queryParams.paginationOn === "true",
    pageIdx: +queryParams.pageIdx || 0,
    userId: queryParams.userId || ''
  };

  const sortBy = {
    sortField: queryParams.sortField || "",
    sortDir: +queryParams.sortDir || 1,
  };

  return { filterBy, sortBy };
}
app.get("/api/bug/:bugId", (req, res) => {
  const bugId = req.params.bugId;
  const visitedBugsIds = req.cookies.visitedBugsIds || [];
  if (visitedBugsIds.includes(bugId)) visitedBugsIds.push(bugId);
  if (visitedBugsIds.length > 3) return res.status(401).send("Wait for a bit");
  res.cookie("visitedBugsIds", visitedBugsIds, { maxAge: 7000 });
  bugService
    .getById(bugId)
    .then((bug) => {
      res.send(bug);
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
  const { title, description, severity, createdAt } = req.body;
  const loggedInUser = authService.validateToken(req.cookies.loginToken)

  if(!loggedInUser) return res.status(401).send('Cannot add car')

  const bug = { title, description, severity, createdAt};
  bugService.save(bug,loggedInUser).then((bug) => res.send(bug));
});

app.delete("/api/bug/:bugId", (req, res) => {
  const bugId = req.params.bugId;
  const loggedInUser = authService.validateToken(req.cookies.loginToken)
  bugService
    .remove(bugId,loggedInUser)
    .then(res.send("OK"))
    .catch((err) => {
      loggerService.error(err);
      res.status(404).send(err);
    });
});

app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            loggerService.error('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body
    authService.checkLogin({ username, password })
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot signup', err)
            res.status(404).send('Invalid Credentials')
        })
})
app.post("/api/auth/signup", (req, res) => {
  const { username, fullname, password } = req.body;
  userService
    .add({ username, fullname, password, isAdmin: false })
    .then((user) => {
      const loginToken = authService.getLoginToken(user);
      res.cookie("loginToken", loginToken);
      res.send(user);
    })
    .catch((err) => {
      loggerService.error("Cannot signup", err);
      res.status(400).send("Cannot signup");
    });
});
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

app.get("/*all", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

const port = 3030;
app.listen(port);
