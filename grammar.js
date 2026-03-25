/**
 * @file OpenC3 Cosmos definition parser
 * @author Michael Hegerhorst <michael.hegerhorst@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "cosmos",
  extras: ($) => [$.comment, /\s/],
  supertypes: ($) => [$.block],
  rules: {
    source_file: ($) => repeat1($.block),
    block: ($) => choice($.command),
    command: ($) =>
      seq(
        "COMMAND",
        field("target_name", $.identifier),
        field("command_name",$.identifier),
        $.endianness,
        optional($._description),
      ),
    comment: (_) => token(seq("#", /.*/)),
    string: (_) => choice(/"[^"]*"/, /'[^']*'/),
    endianness: (_) => choice("BIG_ENDIAN", "LITTLE_ENDIAN"),
    identifier: (_) => /\S+/,

    _description: ($) => field("description", $.string),
    _spacing: ($) => repeat1(choice($._space, $._newline)),
    _space: (_) => /[ \t]+/,
    _newline: (_) => /\r?\n/,
  },
});
