const _ = require('lodash');

function deepScrape(object, desiredKey) {
  let results = [];

  if (_.isArray(object)) {
    results = [...results, ..._.reduce(object, (accumulator, item) => [...accumulator, ...deepScrape(item, desiredKey)], [])];
  } else if (_.isObject(object)) {
    results = _.compact([...results, ..._.reduce(object, (accumulator, value, key) => {
      if (key === desiredKey) {
        return [...accumulator, value];
      } else if (_.isArray(value) || _.isObject(value)) {
        return [...accumulator, ...deepScrape(value, desiredKey)];
      } else {
        return accumulator;
      }
    }, [])]);
  }

  return results;
};

module.exports = {deepScrape};
