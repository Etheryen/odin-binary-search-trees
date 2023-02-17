// prettyPrint function is from The Odin Project
const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
};

function randomNumbersArray(min, max, length) {
  const arr = [];

  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * (max - min) + min));
  }

  return arr;
}

class Node {
  constructor(data, left, right) {
    this.data = data ?? null;
    this.left = left ?? null;
    this.right = right ?? null;
  }
}

class Tree {
  constructor(arr) {
    this.root = Tree.buildTree(arr);
  }

  static buildTree(arr, start = 0, end = [...new Set(arr)]?.length - 1) {
    if (start > end) return null;
    if (start === end) return new Node(arr[start]);

    arr = [...new Set(arr)];
    arr.sort((a, b) => a - b);

    const middle = Math.floor((start + end) / 2);
    if (!arr[middle]) return null;

    const root = new Node(
      arr[middle],
      Tree.buildTree(arr, start, middle - 1),
      Tree.buildTree(arr, middle + 1, end)
    );

    return root;
  }

  insert(value, node = this.root) {
    if (!this.root) this.root = new Node(value);
    if (this.find(value)) return;

    if (value > node?.data) {
      if (!node.right) {
        node.right = new Node(value);
        return;
      }
      this.insert(value, node.right);
    }

    if (value < node?.data) {
      if (!node.left) {
        node.left = new Node(value);
        return;
      }
      this.insert(value, node.left);
    }
  }

  delete(value, node = this.root) {
    if (!this.root?.left && !this.root?.right) {
      this.root = null;
      return;
    }

    if (node?.left?.data === value) {
      node.left = null;
      return;
    }

    if (node?.right?.data === value) {
      node.right = null;
      return;
    }

    if (value > node?.data) {
      this.delete(value, node.right);
    }

    if (value < node?.data) {
      this.delete(value, node.left);
    }
  }

  find(value, node = this.root) {
    if (node?.data === value) {
      return node;
    }

    if (value > node?.data) {
      return this.find(value, node.right);
    }

    if (value < node?.data) {
      return this.find(value, node.left);
    }
  }

  levelOrder(fn) {
    // function provided
    if (fn) {
      if (!this.root) return;
      const queue = [this.root];
      while (queue.length > 0) {
        let current = queue[0];
        fn(current.data);
        if (current?.left) queue.push(current.left);
        if (current?.right) queue.push(current.right);
        queue.shift();
      }
      return;
    }
    // no function provided
    if (!this.root) return [];
    const queue = [this.root];
    const result = [];
    while (queue.length > 0) {
      let current = queue[0];
      result.push(current.data);
      if (current?.left) queue.push(current.left);
      if (current?.right) queue.push(current.right);
      queue.shift();
    }
    return result;
  }

  inorder(fn, node = this.root) {
    // function provided
    if (fn) {
      if (!node) return;
      this.inorder(fn, node.left);
      fn(node);
      this.inorder(fn, node.right);
    }
    // no function provided
    if (!node) return [];
    const result = [];
    result.push(...this.inorder(undefined, node.left));
    result.push(node.data);
    result.push(...this.inorder(undefined, node.right));
    return result;
  }

  preorder(fn, node = this.root) {
    // function provided
    if (fn) {
      if (!node) return;
      fn(node);
      this.preorder(fn, node.left);
      this.preorder(fn, node.right);
    }
    // no function provided
    if (!node) return [];
    const result = [];
    result.push(node.data);
    result.push(...this.preorder(undefined, node.left));
    result.push(...this.preorder(undefined, node.right));
    return result;
  }

  postorder(fn, node = this.root) {
    // function provided
    if (fn) {
      if (!node) return;
      this.postorder(fn, node.left);
      this.postorder(fn, node.right);
      fn(node);
    }
    // no function provided
    if (!node) return [];
    const result = [];
    result.push(...this.postorder(undefined, node.left));
    result.push(...this.postorder(undefined, node.right));
    result.push(node.data);
    return result;
  }

  height(node) {
    if (!node) return -1;
    // level order with node as root
    const queue = [node];
    const childrenArray = [];
    while (queue.length > 0) {
      let current = queue[0];
      childrenArray.push(current);
      if (current?.left) queue.push(current.left);
      if (current?.right) queue.push(current.right);
      queue.shift();
    }
    // return max depth
    return Math.max(
      ...childrenArray.map((childNode) => this.depth(childNode, node))
    );
  }

  depth(node, current = this.root, counter = 0) {
    if (node === current) {
      return counter;
    }

    if (node?.data > current?.data) {
      return this.depth(node, current.right, counter + 1);
    }

    if (node?.data < current?.data) {
      return this.depth(node, current.left, counter + 1);
    }
  }

  isBalanced(node = this.root) {
    if (!node) return true;

    const diff = Math.abs(this.height(node?.left) - this.height(node?.right));
    if (diff <= 1)
      return this.isBalanced(node.left) && this.isBalanced(node.right);
    return false;
  }

  rebalance() {
    this.root = Tree.buildTree(this.inorder());
  }
}

const array = randomNumbersArray(0, 100, 20);
const tree = new Tree(array);

console.log(tree.isBalanced());
console.log(tree.levelOrder());
console.log(tree.preorder());
console.log(tree.postorder());
console.log(tree.inorder());

for (const num of randomNumbersArray(100, 1000, 20)) {
  tree.insert(num);
}

console.log(tree.isBalanced());
tree.rebalance();

console.log(tree.isBalanced());
console.log(tree.levelOrder());
console.log(tree.preorder());
console.log(tree.postorder());
console.log(tree.inorder());

prettyPrint(tree.root);
