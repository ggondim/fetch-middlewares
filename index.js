async function newFetch(request, options) {
  return newFetch.stack(request, options);
}

newFetch.fetch = window.fetch;
newFetch.stack = (request, options) => newFetch.fetch(request, options);

newFetch.use = (layer) => {
  newFetch.stack = layer(newFetch.stack);
};

export default newFetch;