'use strict';

/*
 * Stack
 */
class Stack {
  // Array is used to implement stack
  constructor(size) {
    this.options = Object.assign(
      {
        size: size || 0,
      },
      size,
    );

    this.items = new Array(this.options.size).fill(null);
  }

  /*
   * Push
   * Adds an element to the stack
   */
  push(element) {
    // push element into the items.
    if (this.options.size && this.items.length >= this.options.size) {
      this.items.shift();
    }
    this.items.push(element);
  }

  /*
   * Pop
   * Removes an element from the stack,
   * if the function is call on an empty
   * stack it indicates “Underflow”
   */
  pop() {
    // return top most element in the stack
    // and removes it from the stack
    // Underflow if stack is empty
    if (this.items.length == 0) {
      return 'Underflow';
    }
    return this.items.pop();
  }

  /*
   * Peek
   * returns the top most elements in the
   * stack, but doesn’t delete it.
   */
  peek() {
    // return the top most element from the stack
    // but does'nt delete it.
    return this.items[this.items.length - 1];
  }

  /*
   * isEmpty
   * return true if the stack is empty
   */
  isEmpty() {
    // return true if stack is empty
    return this.items.length == 0;
  }

  /*
   * GetStack
   * This method returns an arrayg in which all the
   * element of an stack is appended.
   */
  get() {
    return this.items;
  }

  /*
   * PrintStack
   * This method returns a string in which all the
   * element of an stack is concatenated.
   */
  printStack() {
    var str = '';
    for (var i = 0; i < this.items.length; i++) str += this.items[i] + ' ';
    return str;
  }
}

export default Stack;
