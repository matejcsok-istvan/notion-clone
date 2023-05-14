export const mockTree = {
  root: {
    index: "root",
    canMove: true,
    isFolder: true,
    children: ["child1", "child2"],
    data: "Root item",
    canRename: true,
  },
  child1: {
    index: "child1",
    canMove: true,
    isFolder: false,
    children: [],
    data: "Child item 1",
    canRename: true,
  },
  child2: {
    index: "child2",
    canMove: true,
    isFolder: false,
    children: [],
    data: "Child item 2",
    canRename: true,
  },
};
