let original = {
  a: 1,
  b: 2,
  c: {
    d: 1,
    e: 2,
    f: 3,
    g: true,
  },
  k: true,
}

let current = {
  a: 1,
  b: 2,
  c: {
    d: 1,
    e: 2,
    f: 3,
    g: true,
  },
  k: true,
}

let update = {
  a: 3,
  b: 2,
  c: {
    d: 3,
    e: 2,
    g: {
      h: "hello",
      i: true,
    },
    j: true,
  },
  l: true,
}

let digitReader = new Vue({
  el: '#digitReader',
  data: {
    original: original,
    current: current,
    update: update,
  }
})

function updateObject(obj1, obj2) {
  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);

  let addKeys = keys2.filter((key) => !keys1.includes(key));
  let removeKeys = keys1.filter((key) => !keys2.includes(key));
  let checkKeys = keys2.filter((key) => keys1.includes(key));

  addKeys.forEach((key) => {
    obj1[key] = obj2[key];
  });

  removeKeys.forEach((key) => {
    delete obj1[key];
  })

  checkKeys.forEach((key) => {
    if (typeof obj1[key] === 'object') {
      updateObject(obj1[key], obj2[key]);
    } else if (obj1[key] != obj2[key]) {
      obj1[key] = obj2[key];
    }
  })
}

console.log('object was:', original);
console.log('object should be:', update);

setTimeout(function() {
  updateObject(current, update);
  console.log('object is:', current);
}, 5000);
