import { get } from "http";
import { utilService } from "./util.service.js";

const BASE_URL = "/api/bug";
const BUG_KEY = "bugDB";
_createBugs();

export const bugService = {
  query,
  get,
  remove,
  save,
  getEmptyBug,
  getDefaultFilter,
};

function query(filterBy = {}) {
  return axios
    .get(BASE_URL)
    .then((res) => res.data)
    .then((bugs) => {
      if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, "i");
        bugs = bugs.filter((bug) => regExp.test(bug.title));
      }

      if (filterBy.minSeverity) {
        bugs = bugs.filter((bug) => bug.severity >= filterBy.minSeverity);
      }

      return bugs;
    });
}

function get(bugId) {
  return axios.get(BASE_URL + "/" + bugId)
  .then(res=>res.data)
}

function remove(bugId){
    return axios.get(BASE_URL + '/' +bugId+'/remove')
}
function save(bug){
    const queryStr = '/save?' +
        `title=${bug.title}&` +
        `description=${bug.description}&` +
        `severity=${bug.severity}&` +
        `createdAt=${bug.createdAt}` +
        `id=${car._id || ''}`
        
        return axios.get(BASE_URL + queryStr)
        .then(res => res.data)
}
function getEmptyBug(title='',description='',severity='',createdAt=Date.now()){
    return {title,description,severity,createdAt}
}
function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}
function _createBugs() {
    let bugs = utilService.loadFromStorage(BUG_KEY)
    if (!bugs || !bugs.length) {
        bugs = []
        bugs.push(_createBug("Infinite Loop Detected",4))
        bugs.push(_createBug("Keyboard Not Found",3))
        bugs.push(_createBug("404 Coffee Not Found",2))
        bugs.push(_createBug("Unexpected Response",1))
        utilService.saveToStorage(BUG_KEY, bugs)
    }
}
function _createBug(title='',severity='',description='',createdAt=Date.now()){
const bug = getEmptyBug(title,severity,description,createdAt)
bug._id = utilService.makeId()
return bug

}