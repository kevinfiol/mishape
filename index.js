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

function validate(schema, obj, res, map, chain) {
    if (!MAP.object(obj)) return addError(res, 'object', obj, chain);
    for (let [key, type] of Object.entries(schema)) {
        let id = chain ? chain+'.'+key : key;
        if (!(key in obj)) addError(res, 'defined', obj[key], id);
        else if (MAP.function(type)) type(obj[key], map) || addError(res, key, obj[key], id);
        else if (MAP.string(type)) map[type](obj[key], MAP) || addError(res, type, obj[key], id);
        else if (MAP.object(type)) validate(schema[key], obj[key], res, map, id);
    }

    return res;
};

function addError(res, type, x, id) {
    if (res.ok) res.ok = false;
    res.errors.push(TypeError(`Expected ${type}, got: ${x}${id ? ' at '+id : ''}`));
}