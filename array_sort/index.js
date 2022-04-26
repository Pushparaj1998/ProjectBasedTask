const express = require('express');

const arr = [ {name: "Tom", age: 15}, 
              {name: "Jerry", age: 11}, 
              {name: "Mr.Bean", age: 40}, 
              {name: "bheam", age: 10} ];

arr.sort((a,b) => {
    return a.age - b.age;
})
console.log("Sorted Array in Ascending Order : ", arr);

arr.sort((a,b) => {
    return b.age - a.age;
})

console.log("Sorted Array in Ascending Order: " , arr);


