# simple-react-tree-view

A simple implementation of tree view component in React.

## Demo

![Demo](https://i.ibb.co/SXkwWcP/simple-tree-demo.gif)


## About 

This simple prototype is part of my research and experiment on how to implement a tree-view component in React.

## Tree structure

![Tree structure](https://i.ibb.co/hYyZdyP/20230523-193255.jpg)

Tree is made up of multiple nodes. A node can have multiple child nodes. Each tree node is an object that has following properties:

- id (node's id)
- name (display name)
- children (a group of other tree nodes object)
- type (either "file" or "directory")

The tree object then needs to be flattened in order to be used as React state. Also, a context menu is essential to be the part of the UI because it helps user to do basic operation such as create, rename or delete nodes.

