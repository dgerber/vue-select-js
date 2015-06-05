
module.exports = {

  replace: true,

  // an 'options' prop would conflict with attribute on the template root node
  props: ['opts', 'value', 'value-index', 'placeholder'],

  template: '<select v-model="valueIndex" options="indexedOptions"></select>',

  computed: {

    indexedOptions: function(){
      var idx = 0,
          values = [],
          idxOpts = []

      if (this.placeholder){
        values.push(undefined)
        idxOpts.push({ value: idx++,
                       disabled: true,
                       text: this.placeholder })
      }
      if (this.opts){
        this.opts.forEach(function(op){
          idxOpts.push(op.options
                       ? { label: op.label, options: op.options.map(index) }
                       : index(op))
        })
      }
      idxOpts.values = values

      return idxOpts

      function index(op){
        if (typeof op === 'object' && 'value' in op){
          values.push(op.value)
          return {value: idx++, text: op.text || op.value}
        } else {
          values.push(op)
          return {value: idx++, text: op}
        }
      }

    },

    value: {
      get: function(){
        return this.$data.value
      },
      set: function(value){
        var vals = this.indexedOptions.values
        this.valueIndex = this.$el.multiple && Array.isArray(value)
          ? value.map(function(v){
            return indexOf(vals, v)
          })
          : indexOf(vals, value)
      }
    },

    valueIndex: {
      get: function(){
        return this.$data.valueIndex
      },
      set: function(idx){
        this.$data.valueIndex = idx
        var vals = this.indexedOptions.values
        this.$data.value = Array.isArray(idx)
          ? idx.map(function(i){
            return vals[i]
          })
          : vals[idx]
      }

    }
  },

  watch: {

    indexedOptions: function(){
      // updates valueIndex
      this.value = this.$data.value
    }

  }

}


function indexOf(arr, x){
  var i, l = arr.length
  for (i = 0; i < l; i++) if (arr[i] === x) return i
  for (i = 0; i < l; i++) if (equal(arr[i], x)) return i
  return -1
}



var hop = Object.prototype.hasOwnProperty,
    ipo = Object.prototype.isPrototypeOf

// typed equal
// http://stackoverflow.com/questions/1068834/object-comparison-in-javascript/1144249#1144249
function equal(){
  if (arguments.length < 1) throw "Need two or more arguments to compare"

  var i, l, leftChain, rightChain
  for (i = 1, l = arguments.length; i < l; i++){
    leftChain = []
    rightChain = []
    if (!_equal(arguments[0], arguments[i])) return false
  }

  return true

  function _equal(x, y){
    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (Number.isNaN(x) && Number.isNaN(y) &&
        typeof x === 'number' && typeof y === 'number'){
      return true
    }

    // Compare primitives and functions.
    // Check if both arguments link to the same object.
    // Especially useful on step when comparing prototypes
    if (x === y) return true

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ((typeof x === 'function' && typeof y === 'function') ||
        (x instanceof Date && y instanceof Date) ||
        (x instanceof RegExp && y instanceof RegExp) ||
        (x instanceof String && y instanceof String) ||
        (x instanceof Number && y instanceof Number)){
      return x.toString() === y.toString()
    }

    // At last checking prototypes as good a we can
    if (!(x instanceof Object && y instanceof Object) ||
        ipo.call(x,y) || ipo.call(y,x) ||
        x.constructor !== y.constructor ||
        x.prototype !== y.prototype){
      return false
    }

    // Check for infinite linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) return false

    // Quick checking of one object beeing a subset of another.
    // todo: cache the structure of arguments[0] for performance
    var p
    for (p in y){
      if (hop.call(y,p) !== hop.call(x,p) || typeof y[p] !== typeof x[p]) return false
    }

    for (p in x){
      if (hop.call(y,p) !== hop.call(x,p) || typeof y[p] !== typeof x[p]) return false

      switch (typeof x[p]){
      case 'object':
      case 'function':
        leftChain.push(x)
        rightChain.push(y)
        if (!_equal(x[p], y[p])) return false
        leftChain.pop()
        rightChain.pop()
        break

      default:
        if (x[p] !== y[p]) return false
      }
    }

    return true
  }

}
