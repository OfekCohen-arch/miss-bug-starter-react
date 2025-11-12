const BASE_URL = "/api/bug";

export const bugService = {
  query,
  getById,
  remove,
  save,
  getEmptyBug,
  getDefaultFilter,
};

function query(filterBy = {}) {
  // const queryParams = `?txt=${filterBy.txt}&minSeverity=${filterBy.minSeverity}`
  return axios.get(BASE_URL , { params: filterBy }).then((res) => res.data);
}

function getById(bugId) {
  return axios.get(BASE_URL + "/" + bugId).then((res) => res.data);
}

function remove(bugId) {
  return axios.delete(BASE_URL + "/" + bugId);
}
function save(bug) {
  if (bug._id) {
    return axios.put(BASE_URL + `/${bug._id}`, bug)
    .then((res) => res.data);
  } 

  else {
    return axios.post(BASE_URL, bug)
    .then((res) => res.data);
  }
}
function getEmptyBug(
  title = "",
  description = "",
  severity = 0,
  createdAt = Date.now()
) {
  return { title, description, severity, createdAt };
}
function getDefaultFilter() {
  return { txt: "", minSeverity: 0, pageIdx: 0, paginationOn: true  };
}
