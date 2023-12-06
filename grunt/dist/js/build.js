(function () {
    function foo(num1, num2) {
        return num1 + num2;
    }
    console.log(foo(24,25));
    console.log("object");
})();;(function () {
    var result = [1, 1, 2, 3, 4, 5].map(function(item, index) {
        return item + 10;
    });
    console.log(result);
})();