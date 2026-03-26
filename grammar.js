/**
 * @file OpenC3 COSMOS definition parser
 * @author Michael Hegerhorst <michael.hegerhorst@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "cosmos",
  extras: ($) => [$.comment, /\s/, "&"],
  supertypes: ($) => [$.block],
  rules: {
    source_file: ($) => repeat1($.block),
    comment: (_) => token(seq("#", /.*/)),
    string: (_) => choice(/".*"/, /'.'/),
    endianness: (_) => choice("BIG_ENDIAN", "LITTLE_ENDIAN"),
    identifier: (_) => /\S+/,
    block: ($) => choice($.command, $.select_command),
    number_dtype: (_) => choice("INT", "UINT", "FLOAT", "DERIVED"),

    command: ($) =>
      seq(
        $.command_definition,
        repeat(
          choice(
            $._command_modifier,
            $.parameter_definition,
            $.append_parameter_definition,
          ),
        ),
      ),
    command_definition: ($) =>
      seq(
        "COMMAND",
        field("target", $.identifier),
        field("name", $.identifier),
        field("endianness", $.endianness),
        optional($._description),
      ),
    parameter_definition: ($) =>
      seq(
        "PARAMETER",
        field("name", $.identifier),
        field("bit_offset", $.number),
        field("bit_size", $.number),
        choice($._number_parameter, $._string_parameter, $._block_parameter),
        optional($._description),
        optional(field("endianness", $.endianness)),
      ),
    append_parameter_definition: ($) =>
      seq(
        "APPEND_PARAMETER",
        field("name", $.identifier),
        field("bit_size", $.number),
        choice($._number_parameter, $._string_parameter, $._block_parameter),
        optional($._description),
        optional(field("endianness", $.endianness)),
      ),
    _command_modifier: ($) =>
      choice(
        $.modifier_hidden,
        $.modifier_disabled,
        $.modifier_hazardous,
        $.modifier_catchall,
        $.modifier_virtual,
        $.modifier_restricted,
        $.modifier_accessor,
        $.modifier_subpacketizer,
        $.modifier_template,
        $.modifier_response,
        $.modifier_error_response,
        $.modifier_related_item,
        $.modifier_screen,
        $.modifier_validator,
        $.modifier_meta,
      ),
    modifier_hidden: (_) => "HIDDEN",
    modifier_disabled: (_) => "DISABLED",
    modifier_hazardous: (_) => "HAZARDOUS",
    modifier_catchall: (_) => "CATCHALL",
    modifier_virtual: (_) => "VIRTUAL",
    modifier_restricted: (_) => "RESTRICTED",
    modifier_accessor: ($) =>
      seq(
        "ACCESSOR",
        field("class", $.identifier),
        field("argument", $.string),
      ),
    modifier_subpacketizer: ($) =>
      seq(
        "SUBPACKETIZER",
        field("class", $.identifier),
        field("argument", $.string),
      ),
    modifier_template: ($) => seq("TEMPLATE", $.string),
    modifier_response: ($) =>
      seq(
        "RESPONSE",
        field("target", $.identifier),
        field("packet", $.identifier),
      ),
    modifier_error_response: ($) =>
      seq(
        "ERROR_RESPONSE",
        field("target", $.identifier),
        field("packet", $.identifier),
      ),
    modifier_related_item: ($) =>
      seq(
        "RELATED_ITEM",
        field("target", $.identifier),
        field("item", $.identifier),
      ),
    modifier_screen: ($) =>
      seq(
        "SCREEN",
        field("target", $.identifier),
        field("screen", $.identifier),
      ),
    modifier_validator: ($) =>
      seq("VALIDATOR", field("class", $.filename), field("argument", $.string)),
    modifier_meta: ($) =>
      seq("META", field("key", $.identifier), field("value", $.identifier)),

    select_command: ($) => $.select_command_definition,
    select_command_definition: ($) =>
      seq(
        "SELECT_COMMAND",
        field("target", $.identifier),
        field("name", $.identifier),
      ),

    filename: (_) => /\w+\.\w+/,
    number: (_) => choice(/(0[xX])?\d+/, /-?\d+(\.\d*)?/, "MAX", "MIN"),
    _number_parameter: ($) =>
      seq(
        field("data_type", $.number_dtype),
        field("min", $.number),
        field("max", $.number),
        field("default", $.number),
      ),
    _string_parameter: ($) =>
      seq(field("data_type", "STRING"), field("default", $.string)),
    _block_parameter: (_) =>
      seq(field("data_type", "BLOCK"), field("default", /0[xX]\d+/)),
    _description: ($) => field("description", $.string),
    _newline: (_) => /\r?\n/,
  },
});
