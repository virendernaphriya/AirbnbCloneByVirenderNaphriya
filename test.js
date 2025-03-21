// console.log(+(null + true) + +"false");
// console.log(+[1,2,3]);
// console.log(+[]);
// console.log(+[4])
// console.log(+"");
// console.log("5"+2);
// console.log("5"-2);
// console.log(5-"true");
// console.log(+"Infinity");
// console.log(+"\t4\n");


// !Unary operator 

// Easy Set

// console.log(!0);
// console.log(!1);
// console.log(!"");
// console.log(!" ");
// console.log(!"hello");

// console.log(!undefined);
// console.log(!null);
// console.log(!NaN);
// console.log(!Infinity);
// console.log(!-0);

// // Medium set
// console.log(!![]);
// console.log(!{});
// console.log(!!{name:"virender"});
// console.log(!!(false || "true"));
// console.log(!!{});


// console.log(!([] + []));
// console.log(!!({} && false));
// console.log(!function() {});
// console.log(!null + !undefined + !NaN);
// console.log(!!(typeof NaN === "number" && !NaN));



const filter={};
let minPrice=1000;
let maxPrice=10000;

if(minPrice || maxPrice){
    filter.price={};
    if(minPrice) filter.price.$gte=Number(minPrice);
    if(maxPrice) filter.price.$lte=Number(maxPrice);
}

filter.placeType=["Cabin","Farm"];
// filter.priceRange={min:minPrice,max:maxPrice};
console.log(filter);


