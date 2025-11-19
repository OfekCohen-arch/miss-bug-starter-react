import fs from "fs";
import {
  makeId,
  readJsonFile,
  writeJsonFile,
} from "../services/util.service.js";

var users = readJsonFile("data/user.json") || [];

export const userService = {
  query,
  getById,
  getByUsername,
  remove,
  add,
};

function query() {
  const usersToReturn = users.map((user) => ({
    _id: user._id,
    fullname: user.fullname,
    username: user.username,
  }));
  return Promise.resolve(usersToReturn);
}
function getById(userId) {
  var user = users.find((currUser) => currUser._id === userId);

  if (!user) return Promise.reject("User not found!");

  user = { ...user };
  delete user.password;

  return Promise.resolve(user);
}
function getByUsername(username) {
  var user = users.find((currUser) => currUser.username === username);
  if (!user) return Promise.resolve(null);

  user = { ...user };

  return Promise.resolve(user);
}
function remove(userId) {
  users = users.filter((currUser) => currUser._id !== userId);

  return _saveUsersToFile()
}
function add(user){
    return getByUsername(user.username)
    .then(existingUser => {
            if (existingUser) return Promise.reject('Username taken')

            user._id = makeId()
            users.push(user)

            return _saveUsersToFile()
                .then(() => {
                    user = { ...user }
                    delete user.password
                    return user
                })
        })
}
function _saveUsersToFile() {
  return new Promise((resolve, reject) => {
    const usersStr = JSON.stringify(users, null, 4);
    fs.writeFile("data/user.json", usersStr, (err) => {
      if (err) {
        return console.log(err);
      }
      resolve();
    });
  });
}
