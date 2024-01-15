const cache = {};

export const setItem = (key, value) => {
    cache[key] = value;
};

export const getItem = (key) => cache[key];

export const deleteItem = (key) => delete cache[key];

export const getLength = () => Object.keys(cache).length;