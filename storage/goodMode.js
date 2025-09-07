// storage/goodMode.js
let goodMode = false;

module.exports = {
  getGoodMode: () => goodMode,
  setGoodMode: (val) => { goodMode = val; }
};
