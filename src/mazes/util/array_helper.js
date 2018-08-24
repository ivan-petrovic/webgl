"use strict";

const last_element_of = (arr) => {
    return arr[arr.length - 1];
}

const random_element_of = (arr) => {
    let index = Math.floor(Math.random() * arr.length);
    return arr.length > 0 ? arr[index] : null;
    // return arr[index];
}

const random_index_of = (arr) => {
    // return arr.length > 0 ? Math.floor(Math.random() * arr.length) : null;
    return Math.floor(Math.random() * arr.length);
}

export default {
    last_element_of,
    random_element_of,
    random_index_of
}
