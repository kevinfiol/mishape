let MAP = {
    'number': Number.isFinite,
    'array': Array.isArray,
    'boolean': x => typeof x == 'boolean',
    'object': x => x != null && typeof x == 'object',
    'string': x => typeof x == 'string',
    'function': x => typeof x == 'function',
    'defined': x => x != undefined
};

export default function(schema, map = {}) {
    return obj => validate(schema, obj, { ok: true, errors: [] }, { ...MAP, ...map });
}

function validate(schema, obj, res, map, name) {
    // if (!MAP.object(schema)) return addError(res, 'object', schema);
    for (let [key, type] of Object.entries(schema)) {
        name = name ? name+'.'+key : key;
        console.log(name);
        if (!(key in obj)) addError(res, 'defined', obj[key], name);
        else if (MAP.function(type)) type(obj[key], MAP) || addError(res, key, obj[key], name);
        else if (MAP.string(type)) map[type](obj[key]) || addError(res, type, obj[key], name);
        else if (MAP.object(type)) validate(schema[key], obj[key], res, map, name);
    }

    return res;
};

function addError(res, type, x, name) {
    if (res.ok) res.ok = false;
    res.errors.push(TypeError(`Expected ${type}, got: ${x} at ${name}}`));
}