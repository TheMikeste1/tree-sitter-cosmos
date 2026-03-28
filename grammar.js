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
    block: ($) => choice($.command, $.select_command),

    comment: (_) => token(seq("#", /.*/)),
    dtype: (_) => choice("INT", "UINT", "FLOAT", "STRING", "BLOCK"),
    endianness: (_) => choice("BIG_ENDIAN", "LITTLE_ENDIAN"),
    number_dtype: (_) => choice("INT", "UINT", "FLOAT", "DERIVED"),

    filename: (_) => /\w+\.\w+/,
    identifier: (_) => /[a-zA-Z_\$][a-zA-Z0-9_\.]*/,
    number: ($) =>
      choice(
        $._hexadecimal_number,
        seq(/-?\d+(\.\d*)?/, optional(/e\d+/)),
        $._octal_number,
        $._binary_number,
        "MAX",
        "MIN",
      ),
    string: (_) => choice(/"(\\"|[^"])+"/, /'(\\'|[^'])+'/),

    modifier_accessor: ($) =>
      seq(
        "ACCESSOR",
        field("class", $.identifier),
        field("argument", $.string),
      ),
    modifier_catchall: (_) => "CATCHALL",
    modifier_default_value: ($) => seq("DEFAULT_VALUE", $.number),
    modifier_description: ($) => seq("DESCRIPTION", $._description),
    modifier_disabled: (_) => "DISABLED",
    modifier_error_response: ($) =>
      seq(
        "ERROR_RESPONSE",
        field("target", $.identifier),
        field("packet", $.identifier),
      ),
    modifier_format_string: ($) => seq("FORMAT_STRING", $.string),
    modifier_hazardous: (_) => "HAZARDOUS",
    modifier_hidden: (_) => "HIDDEN",
    modifier_key: ($) =>
      seq("KEY", field("key", choice($.string, $.identifier))),
    modifier_maximum_value: ($) => seq("MAXIMUM_VALUE", $.number),
    modifier_meta: ($) =>
      seq(
        "META",
        field("key", $.identifier),
        field("value", choice($.identifier, $.string)),
      ),
    modifier_minimum_value: ($) => seq("MINIMUM_VALUE", $.number),
    modifier_obfuscate: (_) => "OBFUSCATE",
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
    modifier_overlap: (_) => "OVERLAP",
    modifier_related_item: ($) =>
      seq(
        "RELATED_ITEM",
        field("target", $.identifier),
        field("item", $.identifier),
      ),
    modifier_required: (_) => "REQUIRED",
    modifier_response: ($) =>
      seq(
        "RESPONSE",
        field("target", $.identifier),
        field("packet", $.identifier),
      ),
    modifier_restricted: (_) => "RESTRICTED",
    modifier_screen: ($) =>
      seq(
        "SCREEN",
        field("target", $.identifier),
        field("screen", $.identifier),
      ),
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
    modifier_subpacketizer: ($) =>
      seq(
        "SUBPACKETIZER",
        field("class", $.identifier),
        field("argument", $.string),
      ),
    modifier_template: ($) => seq("TEMPLATE", $.string),
    modifier_units: ($) =>
      seq(
        "UNITS",
        field("full_name", $.string),
        field("abbreviated", $.string),
      ),
    modifier_validator: ($) =>
      seq("VALIDATOR", field("class", $.filename), field("argument", $.string)),
    modifier_variable_bit_size: ($) =>
      seq(
        "VARIABLE_BIT_SIZE",
        field("length_field", $.identifier),
        prec(1, optional(field("bits_per_count", $.number))),
        prec(2, optional(field("bit_offset", $.number))),
      ),
    modifier_virtual: (_) => "VIRTUAL",

    _command_modifier: ($) =>
      choice(
        $.modifier_accessor,
        $.modifier_catchall,
        $.modifier_disabled,
        $.modifier_error_response,
        $.modifier_hazardous,
        $.modifier_hidden,
        $.modifier_meta,
        $.modifier_related_item,
        $.modifier_response,
        $.modifier_restricted,
        $.modifier_screen,
        $.modifier_subpacketizer,
        $.modifier_template,
        $.modifier_validator,
        $.modifier_virtual,
      ),
    _parameter_modifier: ($) =>
      choice(
        $.modifier_default_value,
        $.modifier_description,
        $.modifier_format_string,
        $.modifier_key,
        $.modifier_maximum_value,
        $.modifier_meta,
        $.modifier_minimum_value,
        $.modifier_obfuscate,
        $.modifier_overflow,
        $.modifier_overlap,
        $.modifier_required,
        $.modifier_state,
        $.modifier_units,
        $.modifier_variable_bit_size,
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
          choice(
            $.append_array_parameter_definition,
            $.append_id_parameter_definition,
            $.append_parameter_definition,
            $.array_parameter_definition,
            $.id_parameter_definition,
            $.parameter_definition,
          ),
          repeat(seq($._newline, $._parameter_modifier)),
          $._newline,
        ),
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
    id_parameter_definition: ($) =>
      seq(
        "ID_PARAMETER",
        field("name", $.identifier),
        field("bit_offset", $.number),
        field("bit_size", $.number),
        choice($._number_parameter, $._string_parameter, $._block_parameter),
        optional($._description),
        optional(field("endianness", $.endianness)),
      ),
    append_id_parameter_definition: ($) =>
      seq(
        "APPEND_ID_PARAMETER",
        field("name", $.identifier),
        field("bit_size", $.number),
        choice($._number_parameter, $._string_parameter, $._block_parameter),
        optional($._description),
        optional(field("endianness", $.endianness)),
      ),
    array_parameter_definition: ($) =>
      seq(
        "ARRAY_PARAMETER",
        field("name", $.identifier),
        field("bit_offset", $.number),
        field("item_bit_size", $.number),
        field("item_data_type", $.dtype),
        field("array_bit_size", $.number),
        optional($._description),
        optional(field("endianness", $.endianness)),
      ),
    append_array_parameter_definition: ($) =>
      seq(
        "APPEND_ARRAY_PARAMETER",
        field("name", $.identifier),
        field("item_bit_size", $.number),
        field("item_data_type", $.dtype),
        field("array_bit_size", $.number),
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
    _octal_number: (_) => /0[0-7]\+/,
    _binary_number: (_) => /0b[01]\+/,
    _description: ($) => field("description", $.string),
    _newline: (_) => /\r?\n/,
    _line_continuation: (_) => token(seq("&", /\r?\n/)),
  },
});
