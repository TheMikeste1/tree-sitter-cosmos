/**
 * @file OpenC3 COSMOS definition parser
 * @author Michael Hegerhorst <michael.hegerhorst@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "cosmos",
  extras: ($) => [$.comment, /\s/, $._line_continuation],
  supertypes: ($) => [$.block],
  rules: {
    source_file: ($) => repeat($.block),
    comment: (_) => token(seq("#", /.*/)),
    string: (_) => choice(/"(\\"|[^"])+"/, /'(\\'|[^'])+'/),
    endianness: (_) => choice("BIG_ENDIAN", "LITTLE_ENDIAN"),
    identifier: (_) => /\S+/,
    block: ($) => choice($.command, $.select_command),
    number_dtype: (_) => choice("INT", "UINT", "FLOAT", "DERIVED"),
    filename: (_) => /\w+\.\w+/,
    number: ($) => choice($._hexadecimal_number, /-?\d+(\.\d*)?/, "MAX", "MIN"),
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
      seq(
        "META",
        field("key", $.identifier),
        field("value", choice($.identifier, $.string)),
      ),
    modifier_format_string: ($) => seq("FORMAT_STRING", $.string),
    modifier_units: ($) =>
      seq(
        "UNITS",
        field("full_name", $.string),
        field("abbreviated", $.string),
      ),
    modifier_description: ($) => seq("DESCRIPTION", $._description),
    modifier_overlap: (_) => "OVERLAP",
    modifier_key: ($) =>
      seq("KEY", field("key", choice($.string, $.identifier))),
    modifier_variable_bit_size: ($) =>
      seq(
        "VARIABLE_BIT_SIZE",
        field("length_field", $.identifier),
        prec(1, optional(field("bits_per_count", $.number))),
        prec(2, optional(field("bit_offset", $.number))),
      ),
    modifier_obfuscate: (_) => "OBFUSCATE",
    modifier_required: (_) => "REQUIRED",
    modifier_minimum_value: ($) => seq("MINIMUM_VALUE", $.number),
    modifier_maximum_value: ($) => seq("MAXIMUM_VALUE", $.number),
    modifier_default_value: ($) => seq("DEFAULT_VALUE", $.number),
    modifier_state: ($) =>
      seq(
        "STATE",
        field("name", $.identifier),
        field("value", $.number),
        optional(
          choice(
            $.modifier_state_disable_message,
            seq($.modifier_hazardous, optional($._description)),
          ),
        ),
      ),
    modifier_state_disable_message: (_) => "DISABLE_MESSAGES",
    modifier_overflow: (_) =>
      seq(
        "OVERFLOW",
        optional(
          field(
            "behavior",
            choice("ERROR", "ERROR_ALLOW_HEX", "TRUNCATE", "SATURATE"),
          ),
        ),
      ),

    command: ($) =>
      seq(
        $.command_definition,
        $._newline,
        repeat(choice($._command_modifier, $.parameter)),
      ),
    command_definition: ($) =>
      seq(
        "COMMAND",
        field("target", $.identifier),
        field("name", $.identifier),
        field("endianness", $.endianness),
        optional($._description),
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

    select_command: ($) =>
      seq($.select_command_definition, repeat(choice($.delete_parameter))),
    select_command_definition: ($) =>
      seq(
        "SELECT_COMMAND",
        field("target", $.identifier),
        field("name", $.identifier),
      ),

    parameter: ($) =>
      prec.right(
        seq(
          choice($.parameter_definition, $.append_parameter_definition),
          repeat(seq($._newline, $._parameter_modifier)),
          $._newline,
        ),
      ),

    _parameter_modifier: ($) =>
      choice(
        $.modifier_format_string,
        $.modifier_units,
        $.modifier_description,
        $.modifier_meta,
        $.modifier_overlap,
        $.modifier_key,
        $.modifier_variable_bit_size,
        $.modifier_obfuscate,
        $.modifier_required,
        $.modifier_minimum_value,
        $.modifier_maximum_value,
        $.modifier_default_value,
        $.modifier_state,
        $.modifier_overflow,
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

    delete_parameter: ($) =>
      seq("DELETE_PARAMETER", field("name", $.identifier)),

    _number_parameter: ($) =>
      seq(
        field("data_type", $.number_dtype),
        field("min", $.number),
        field("max", $.number),
        field("default", $.number),
      ),
    _string_parameter: ($) =>
      seq(field("data_type", "STRING"), field("default", $.string)),
    _block_parameter: ($) =>
      seq(field("data_type", "BLOCK"), field("default", $._hexadecimal_number)),
    _hexadecimal_number: (_) => /0[xX][0-9a-fA-F]+/,
    _description: ($) => field("description", $.string),
    _newline: (_) => /\r?\n/,
    _line_continuation: (_) => token(seq("&", /\r?\n/)),
  },
});
