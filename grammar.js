/**
 * @file OpenC3 Cosmos definition parser
 * @author Michael Hegerhorst <michael.hegerhorst@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "cosmos",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
