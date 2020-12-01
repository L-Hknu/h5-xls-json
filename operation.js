//苦海无涯回头是岸
const charCodeOfDot = '.'.charCodeAt(0)
const MAX_SAFE_INTEGER = 9007199254740991
const reEscapeChar = /\\(\\)?/g
const reIsUint = /^(?:0|[1-9]\d*)$/
const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/
const reIsPlainProp = /^\w*$/
const rePropName = RegExp(
    '[^.[\\]]+' + '|' +
    '\\[(?:' +
    '([^"\'][^[]*)' + '|' +
    '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
    ')\\]' + '|' +
    '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))', 'g')
const hasOwnProperty = Object.prototype.hasOwnProperty
const toString = Object.prototype.toString
function isIndex(value, length) {
    const type = typeof value
    length = length == null ? MAX_SAFE_INTEGER : length
  
    return !!length &&
      (type === 'number' ||
        (type !== 'symbol' && reIsUint.test(value))) &&
          (value > -1 && value % 1 == 0 && value < length)
}
function isObject(value) {
    const type = typeof value
    return value != null && (type === 'object' || type === 'function')
}

function toKey(value) {
    if (typeof value === 'string' || isSymbol(value)) {
        return value
    }

    function getTag(value) {
        if (value == null) {
            return value === undefined ? '[object Undefined]' : '[object Null]'
        }
        return toString.call(value)
    }

    function isSymbol(value) {
        const type = typeof value
        return type == 'symbol' || (type === 'object' && value != null && getTag(value) == '[object Symbol]')
    }
    const result = `${value}`
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result
}

function memoize(func, resolver) {
    if (typeof func !== 'function' || (resolver != null && typeof resolver !== 'function')) {
        throw new TypeError('Expected a function')
    }
    const memoized = function (...args) {
        const key = resolver ? resolver.apply(this, args) : args[0]
        const cache = memoized.cache

        if (cache.has(key)) {
            return cache.get(key)
        }
        const result = func.apply(this, args)
        memoized.cache = cache.set(key, result) || cache
        return result
    }
    memoized.cache = new(memoize.Cache || Map)
    return memoized
}

memoize.Cache = Map

function memoizeCapped(func) {
    const result = memoize(func, (key) => {
        const {
            cache
        } = result
        if (cache.size === MAX_MEMOIZE_SIZE) {
            cache.clear()
        }
        return key
    })

    return result
}


const stringToPath = memoizeCapped((string) => {
    const result = []
    if (string.charCodeAt(0) === charCodeOfDot) {
        result.push('')
    }
    string.replace(rePropName, (match, expression, quote, subString) => {
        let key = match
        if (quote) {
            key = subString.replace(reEscapeChar, '$1')
        } else if (expression) {
            key = expression.trim()
        }
        result.push(key)
    })
    return result
})

function isKey(value, object) {
    if (Array.isArray(value)) {
        return false
    }
    const type = typeof value
    if (type === 'number' || type === 'boolean' || value == null) {
        return true
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object))
}

function castPath(value, object) {
    if (Array.isArray(value)) {
        return value
    }
    return isKey(value, object) ? [value] : stringToPath(value)
}

function baseAssignValue(object, key, value) {
    if (key == '__proto__') {
        Object.defineProperty(object, key, {
            'configurable': true,
            'enumerable': true,
            'value': value,
            'writable': true
        })
    } else {
        object[key] = value
    }
}

function eq(value, other) {
    return value === other || (value !== value && other !== other)
}

function assignValue(object, key, value) {
    const objValue = object[key]

    if (!(hasOwnProperty.call(object, key) && eq(objValue, value))) {
        if (value !== 0 || (1 / value) === (1 / objValue)) {
            baseAssignValue(object, key, value)
        }
    } else if (value === undefined && !(key in object)) {
        baseAssignValue(object, key, value)
    }
}

function baseSet(object, path, value, customizer) {
    if (!isObject(object)) {
        return object
    }
    path = castPath(path, object)

    const length = path.length
    const lastIndex = length - 1

    let index = -1
    let nested = object

    while (nested != null && ++index < length) {
        const key = toKey(path[index])
        let newValue = value

        if (index != lastIndex) {
            const objValue = nested[key]
            newValue = customizer ? customizer(objValue, key, nested) : undefined
            if (newValue === undefined) {
                newValue = isObject(objValue) ?
                    objValue :
                    (isIndex(path[index + 1]) ? [] : {})
            }
        }
        assignValue(nested, key, newValue)
        nested = nested[key]
    }
    return object
}
function set(object, path, value) {
    return object == null ? object : baseSet(object, path, value)
  }