'use strict';

const randomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports = (spinner) => {
  const colors = ['red', 'green', 'yellow', 'blue'];
  const randomColor = colors[randomNumber(0, colors.length - 1)];
  spinner.color = randomColor;
};
