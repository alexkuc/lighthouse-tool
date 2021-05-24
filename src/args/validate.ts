export default (args: any) => {
  if (typeof args.repeat !== 'number') {
    throw new Error('The repeat parameter should be an integer!');
  }

  if (args.repeat % 1 !== 0) {
    throw new Error('The repeat parameter should be an integer!');
  }

  if (args.repeat < 0) {
    throw new Error('The repeat parameter cannot be less than 1!');
  }
};
