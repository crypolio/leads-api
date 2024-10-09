'use strict';

import Stack from '../Stack';

// beforeEach((done) => {
// 	const stack = new Stack();
// })

describe('Stack class', () => {
  const stack = new Stack();

  it('testing isEmpty', () => {
    expect(stack.isEmpty()).toEqual(true);
  });

  it('testing underflow', () => {
    expect(stack.pop()).toEqual('Underflow');
  });

  it('adding element to the stack', () => {
    stack.push(10);
    stack.push(20);
    stack.push(30);

    expect(stack.printStack()).toEqual('10 20 30 ');
  });

  it('returns value in stack', () => {
    expect(stack.peek()).toEqual(30);
  });

  it('returns value and remove it from stack', () => {
    expect(stack.pop()).toEqual(30);
  });

  it('print stack', () => {
    expect(stack.printStack()).toEqual('10 20 ');
  });

  it('get stack value', () => {
    expect(stack.get()).toEqual([10, 20]);
  });
});
