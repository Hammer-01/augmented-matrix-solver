// TODO: add better fraction handling (using oop? or strings as input then oop?)

var AugmentedMatrix = function(matrix) {
    this.m = matrix || [[1,0,0,0],[0,1,0,0],[0,0,1,0]]; // defaults to x=0, y=0, z=0
    this.s = this.m.length; // size of the matrix

    // validate matrix
    for (var i = 0; i < this.s; i++) {
        if (this.m[i].length !== this.s + 1) throw new Error("Invalid size. Matrix must have a number of columns one greater than the number of rows.");
    }
};

AugmentedMatrix.prototype.solve = function(showSteps, log) {
    log ||= console.log;
    let stepStr; // a temporary string to hold the values that will change after each step (used with showSteps)
    if (showSteps) log(`Starting Matrix:\n${this}`);
    for (let a = 0; a < this.s; a++) {
        stepStr = this.m[a][a];
        this.mul(a);
        if (showSteps && stepStr) log(`Multiply row ${a+1} by 1/${stepStr}:\n${this}`);
        for (let b = 1; b < this.s; b++) {
            stepStr = this.m[(a+b)%this.s][a];
            this.sub((a + b) % this.s, a);
            if (showSteps) log(`Subtract ${stepStr} × row ${a+1} from row ${(a+b)%this.s+1}:\n${this}`);
        }
    }
    // Convert -0 to 0 (may remove if later conversion automatically converts it)
    this.m.forEach((r, ri) => {r.forEach((c, ci) => {if (c === -0) {this.m[ri][ci] = 0;}})});
    return this;
};

AugmentedMatrix.prototype.mul = function(row) {
    let num = parseFloat((1 / this.m[row][row]).toPrecision(15)); // fix floating point arithmetic rounding error
    if (!isFinite(num)) return; // skip if this.m[row][row] is 0 (caused by infinite solutions)
    this.m[row].forEach((x, i) => {this.m[row][i] *= num; this.m[row][i] = parseFloat(this.m[row][i].toPrecision(15));});
};

AugmentedMatrix.prototype.sub = function(row1, row2) {
    let num = parseFloat(this.m[row1][row2].toPrecision(15)); // fix floating point arithmetic rounding error
    this.m[row1].forEach((x, i) => {this.m[row1][i] -= num * this.m[row2][i]; this.m[row1][i] = parseFloat(this.m[row1][i].toPrecision(15));});
};

AugmentedMatrix.prototype.toString = function() {
    let str = "";
    for (let r = 0; r < this.s; r++) str += `[${this.m[r]}]\n`;
    return str;
};

// USAGE
/*
var matrix = new AugmentedMatrix([
    [1,2,3,13],
    [-1,-3,2,2],
    [-1,-4,7,10]
]);

matrix.solve(true);
console.log(matrix.toString());
*/
