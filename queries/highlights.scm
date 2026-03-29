; Identifiers
(identifier) @variable

; Keywords
"COMMAND" @keyword
"SELECT_COMMAND" @keyword
"PARAMETER" @keyword
"APPEND_PARAMETER" @keyword
"ID_PARAMETER" @keyword
"APPEND_ID_PARAMETER" @keyword
"ARRAY_PARAMETER" @keyword
"APPEND_ARRAY_PARAMETER" @keyword
"DELETE_PARAMETER" @keyword

; Modifiers
"ACCESSOR" @keyword
(modifier_catchall) @keyword
"DEFAULT_VALUE" @keyword
"DESCRIPTION" @keyword
(modifier_disabled) @keyword
"ERROR_RESPONSE" @keyword
"FORMAT_STRING" @keyword
(modifier_hazardous) @keyword
(modifier_hidden) @keyword
"KEY" @keyword
"MAXIMUM_VALUE" @keyword
"META" @keyword
"MINIMUM_VALUE" @keyword
(modifier_obfuscate) @keyword
"OVERFLOW" @keyword
(modifier_overlap) @keyword
"RELATED_ITEM" @keyword
(modifier_required) @keyword
"RESPONSE" @keyword
(modifier_restricted) @keyword
"SCREEN" @keyword
"STATE" @keyword
(modifier_state_disable_message) @keyword
"SUBPACKETIZER" @keyword
"TEMPLATE" @keyword
"UNITS" @keyword
"VALIDATOR" @keyword
"VARIABLE_BIT_SIZE" @keyword
(modifier_virtual) @keyword

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

; Comments
(comment) @comment

; Specific Fields
(command_definition target: (identifier) @type)
(command_definition name: (identifier) @function)
(select_command_definition target: (identifier) @type)
(select_command_definition name: (identifier) @function)
(parameter_definition name: (identifier) @variable.parameter)
(append_parameter_definition name: (identifier) @variable.parameter)
(id_parameter_definition name: (identifier) @variable.parameter)
(append_id_parameter_definition name: (identifier) @variable.parameter)
(array_parameter_definition name: (identifier) @variable.parameter)
(append_array_parameter_definition name: (identifier) @variable.parameter)
(delete_parameter name: (identifier) @variable.parameter)

; Modifier fields
(modifier_accessor class: (identifier) @type)
(modifier_error_response target: (identifier) @type packet: (identifier) @function)
(modifier_key key: (identifier) @variable.member)
(modifier_meta key: (identifier) @variable.member)
(modifier_related_item target: (identifier) @type item: (identifier) @variable.parameter)
(modifier_response target: (identifier) @type packet: (identifier) @function)
(modifier_screen target: (identifier) @type screen: (identifier) @variable.member)
(modifier_state name: (identifier) @variable.member)
(modifier_subpacketizer class: (identifier) @type)
(modifier_variable_bit_size length_field: (identifier) @variable.parameter)
