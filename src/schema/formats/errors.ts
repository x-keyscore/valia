export const formatErrors = {
	ARRAY: {
        ITEM_INVALID:
		    "The 'item' criterion must be of type Plain Object.",
        EMPTY_INVALID:
            "The 'empty' criterion must be of type Boolean.",
        MIN_INVALID:
            "The 'min' criterion must be of type Number.",
        MAX_INVALID:
            "The 'max' criterion must be of type Number.",
        MIN_GREATER_THAN_MAX:
            "The 'min' criterion cannot be greater than 'max'."
    },
    NUMBER: {
        MIN_INVALID:
		    "The 'min' criterion must be of type Number.",
        MAX_INVALID:
            "The 'max' criterion must be of type Number.",
        MIN_GREATER_THAN_MAX:
            "The 'min' criterion cannot be greater than 'max'.",
        ENUM_INVALID:
            "The 'enum' criterion must be of type Array or Plain Object.",
        ENUM_ARRAY_ITEM_INVALID:
            "In 'enum' criterion the item must be of type String.",
        ENUM_OBJECT_VALUE_INVALID:
            "In 'enum' criterion the value must be of type String.",
        CUSTOM_INVALID:
            "The 'custom' criterion must be of type Basic Function."
    },
    RECORD: {
        KEY_INVALID:
		    "The 'key' criterion must be of type Plain Object.",
        VALUE_INVALID:
            "The 'value' criterion must be of type Plain Object.",
        EMPTY_INVALID:
            "The 'empty' criterion must be of type Boolean.",
        MIN_INVALID:
            "The 'min' criterion must be of type Number.",
        MAX_INVALID:
            "The 'max' criterion must be of type Number.",
        MIN_GREATER_THAN_MAX:
            "The 'min' criterion cannot be greater than 'max'."
    },
    SIMPLE: {
        SIMPLE_INVALID:
            "The 'simple' criterion must be of type String",
        SIMPLE_VALUE_INVALID:
            "The value of 'simple' criterion is not recognized."
    },
    STRING: {
        EMPTY_INVALID:
		    "The 'empty' criterion must be of type Boolean.",
        MIN_INVALID:
            "The 'min' criterion must be of type Number.",
        MAX_INVALID:
            "The 'max' criterion must be of type Number.",
        MIN_GREATER_THAN_MAX:
            "The 'min' criterion cannot be greater than 'max'.",
        ENUM_INVALID:
            "The 'enum' criterion must be of type Array or Plain Object.",
        ENUM_ARRAY_ITEM_INVALID:
            "In 'enum' criterion the item must be of type String.",
        ENUM_OBJECT_VALUE_INVALID:
            "In 'enum' criterion the value must be of type String.",
        REGEX_INVALID:
            "The 'regex' criterion must be of type String or RegExp Object.",
        TESTERS_INVALID:
            "The 'testers' criterion must be of type Plain Object.",
        TESTERS_OBJECT_KEY_INVALID:
            "In 'testers' criterion the key must be a name of string tester.",
        TESTERS_OBJECT_VALUE_INVALID:
            "In 'testers' criterion the value of key must be type Boolean or Plain Object.",
        CUSTOM_INVALID:
            "The 'custom' criterion must be of type Basic Function."
    },
    STRUCT: {
        STRUCT_INVALID:
		    "The 'struct' criterion must be of type Plain Object.",
        STRUCT_OBJECT_VALUE_INVALID:
            "In 'struct' criterion the value of key must be of type Plain Object.",
        OPTIONAL_INVALID:
            "The 'optional' criterion must be of type Boolean or Array.",
        OPTIONAL_ARRAY_ITEM_INVALID:
            "In 'optional' criterion the item must be of type String or Symbol.",
        ADDITIONAL_INVALID:
            "The 'additional' criterion must be of type Boolean or a Plain Object.",
        ADDITIONAL_OBJECT_INVALID:
            "IN 'additional' criterion the criteria node must be of type 'record'."
    },
    SYMBOL: {
        SYMBOL_INVALID:
            "The 'symbol' criterion must be of type Symbol."
    },
    TUPLE: {
        TUPLE_INVALID:
            "The 'tuple' criterion must be of type Plain Object.",
        TUPLE_ARRAY_ITEM_INVALID:
            "In 'tuple' criterion the item must be of type Plain Object or Array.",
        ADDITIONAL_INVALID:
            "The 'additional' criterion must be of type Boolean or a Plain Object.",
        ADDITIONAL_OBJECT_INVALID:
            "IN 'additional' criterion the criteria node must be of type 'array'."
    },
    UNION: {
        UNION_INVALID:
            "The 'union' criterion must be of type Array.",
        UNION_ARRAY_ITEM_INVALID:
            "In 'union' criterion the item must be of type Plain Object.",
    }
};