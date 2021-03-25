import Big from 'big.js';

export function bnToBig(value, denomination): Big {
    Big.NE = -(denomination - 1);
    return new Big(value.toString()).div(Math.pow(10, denomination))
}