import express from "express";
import session from "express-session";
import { Router } from "express";
import fileStore from "session-file-store";
import auth from "./auth.js"

const sessionRouter = Router();

const FileStore = fileStore(session);

sessionRouter.use(
  session({
    store: new FileStore({ path: "./sessions", ttl: 3, retries: 0 }),
    secret: "my-secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

sessionRouter.get("/public", (request, response) => {
  if (!request.session) {
    request.session = {};
  }
  if (!request.session.counter) {
    request.session.counter = 1;
    return response.send({ message: "Welcome!" });
  }
  request.session.counter++;
  response.send({
    message: `The site has been visited ${request.session.counter} times.`,
  });
});

sessionRouter.get("/private", auth, (request, response) => {
  if (!request.session?.counter) {
    request.session.counter = 1;
    return response.send({ message: "Welcome!" });
  }

  request.session.counter++;
  response.send({
    message: `The site has been visited ${request.session.counter} times.`,
  });
});

sessionRouter.post("/login", (request, response) => {
  const { username, password } = request.body;
  if (username !== "pepe" || password !== "12345678") {
    return response.status(401).send({ message: "Login Failed!" });
  }
  request.session.user = username;
  request.session.admin = true;
  response.send({ message: "Login Success!" });
});
sessionRouter.post("/logout", (request, response) => {
  const { username, password } = request.body;
  request.session.destroy((err) => {
    if (!err) {
      return response.send({ message: "Logout OK!" });
    }
    response.send({ message: "Logout Error!", body: err });
  });
});

export default sessionRouter;
