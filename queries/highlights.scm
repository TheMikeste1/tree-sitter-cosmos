; Identifiers
(identifier) @variable

; Keywords
"COMMAND" @keyword
"SELECT_COMMAND" @keyword
"TELEMETRY" @keyword
"SELECT_TELEMETRY" @keyword
"STRUCTURE" @keyword
"APPEND_STRUCTURE" @keyword
"PARAMETER" @keyword
"APPEND_PARAMETER" @keyword
"ID_PARAMETER" @keyword
"APPEND_ID_PARAMETER" @keyword
"ARRAY_PARAMETER" @keyword
"APPEND_ARRAY_PARAMETER" @keyword
"SELECT_PARAMETER" @keyword
"DELETE_PARAMETER" @keyword
"ITEM" @keyword
"APPEND_ITEM" @keyword
"ID_ITEM" @keyword
"APPEND_ID_ITEM" @keyword
"ARRAY_ITEM" @keyword
"APPEND_ARRAY_ITEM" @keyword
"SELECT_ITEM" @keyword
"DELETE_ITEM" @keyword

; Modifiers
"ACCESSOR" @keyword
(modifier_allow_short) @keyword
(modifier_catchall) @keyword
"CONVERTED_DATA" @keyword
"DEFAULT_VALUE" @keyword
"DESCRIPTION" @keyword
(modifier_disable_messages) @keyword
(modifier_disabled) @keyword
"ERROR_RESPONSE" @keyword
"FORMAT_STRING" @keyword
(modifier_hazardous) @keyword
(modifier_hidden) @keyword
(modifier_ignore_overlap) @keyword
"KEY" @keyword
"LIMITS" @keyword
"LIMITS_GROUP" @keyword
"LIMITS_GROUP_ITEM" @keyword
"LIMITS_RESPONSE" @keyword
"MAXIMUM_VALUE" @keyword
"META" @keyword
"MINIMUM_VALUE" @keyword
(modifier_obfuscate) @keyword
"OVERFLOW" @keyword
(modifier_overflow) @keyword
"RELATED_ITEM" @keyword
(modifier_required) @keyword
"RESPONSE" @keyword
(modifier_restricted) @keyword
"SCREEN" @keyword
"STATE" @keyword
"SUBPACKETIZER" @keyword
"TEMPLATE" @keyword
"TEMPLATE_BASE64" @keyword
"TEMPLATE_FILE" @keyword
"UNITS" @keyword
"VALIDATOR" @keyword
"VARIABLE_BIT_SIZE" @keyword
(modifier_virtual) @keyword

; Conversions
"READ_CONVERSION" @keyword
"WRITE_CONVERSION" @keyword
"POLY_READ_CONVERSION" @keyword
"POLY_WRITE_CONVERSION" @keyword
"SEG_POLY_READ_CONVERSION" @keyword
"GENERIC_READ_CONVERSION_START" @keyword
"GENERIC_READ_CONVERSION_END" @keyword
"GENERIC_WRITE_CONVERSION_START" @keyword
"GENERIC_WRITE_CONVERSION_END" @keyword

; Types
"INT" @type
"UINT" @type
"FLOAT" @type
"STRING" @type
"BLOCK" @type
"DERIVED" @type

; Constants
"BIG_ENDIAN" @constant
"LITTLE_ENDIAN" @constant
"MAX" @constant
"MIN" @constant
"ERROR" @constant
"ERROR_ALLOW_HEX" @constant
"TRUNCATE" @constant
"SATURATE" @constant

; Literals
(string) @string
(number) @number
(filename) @string
(code) @embedded

; Comments
(comment) @comment

; Specific Fields
(command_definition target: (identifier) @type)
(command_definition name: (identifier) @function)
(select_command_definition target: (identifier) @type)
(select_command_definition name: (identifier) @function)
(telemetry_definition target: (identifier) @type)
(telemetry_definition name: (identifier) @function)
(select_telemetry_definition target: (identifier) @type)
(select_telemetry_definition name: (identifier) @function)
(structure_definition name: (identifier) @type)
(append_structure_definition name: (identifier) @type)
(parameter_definition name: (identifier) @variable.parameter)
(append_parameter_definition name: (identifier) @variable.parameter)
(id_parameter_definition name: (identifier) @variable.parameter)
(append_id_parameter_definition name: (identifier) @variable.parameter)
(array_parameter_definition name: (identifier) @variable.parameter)
(append_array_parameter_definition name: (identifier) @variable.parameter)
(select_parameter_definition name: (identifier) @variable.parameter)
(delete_parameter name: (identifier) @variable.parameter)
(item_definition name: (identifier) @variable.parameter)
(append_item_definition name: (identifier) @variable.parameter)
(id_item_definition name: (identifier) @variable.parameter)
(append_id_item_definition name: (identifier) @variable.parameter)
(array_item_definition name: (identifier) @variable.parameter)
(append_array_item_definition name: (identifier) @variable.parameter)
(select_item_definition name: (identifier) @variable.parameter)
(delete_item_definition name: (identifier) @variable.parameter)

; Modifier fields
(modifier_accessor class: (identifier) @type)
(modifier_converted_data type: (identifier) @type)
(modifier_error_response target: (identifier) @type packet: (identifier) @function)
(modifier_key key: (identifier) @variable.member)
(modifier_limits set: (identifier) @variable.member enabled: (identifier) @constant)
(modifier_limits_group (identifier) @variable.member)
(modifier_limits_group_item target: (identifier) @type packet: (identifier) @function item: (identifier) @variable.parameter group: (identifier) @variable.member)
(modifier_limits_response script: (identifier) @function)
(modifier_meta key: (identifier) @variable.member)
(modifier_processor class: (identifier) @type)
(modifier_related_item target: (identifier) @type item: (identifier) @variable.parameter)
(modifier_response target: (identifier) @type packet: (identifier) @function)
(modifier_screen target: (identifier) @type screen: (identifier) @variable.member)
(modifier_state name: (identifier) @variable.member)
(modifier_subpacketizer class: (identifier) @type)
(modifier_units full_name: (string) @string abbreviated: (string) @string)
(modifier_validator class: (filename) @string argument: (string) @string)
(modifier_variable_bit_size length_field: (identifier) @variable.parameter)

; Conversion fields
(conversion_read script: (identifier) @function)
(conversion_write script: (identifier) @function)
