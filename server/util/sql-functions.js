function makeSqlArr(arr) {
  return `{${arr.map((el) => `"${el}"`)}}`;
}

function makeSlug(name) {
  return name
    .replace(/[^a-zA-Z\s]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

module.exports = { makeSqlArr, makeSlug };
