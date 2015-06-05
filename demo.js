var Vue = require('vue')
var Select = require('./select')


var demo = new Vue({

  template:
    '<div><h2>Simple select</h2>' +
    '<select-js opts="{{opts}}" value="{{val}}" placeholder="--choose an option--" v-ref="sel"></select-js>' +
    '<h4>Selected value:</h4><pre>{{ val | jsonly }}</pre></div>' +
    '<div><h2>Multiple select</h2>' +
    '<select-js opts="{{opts}}" value="{{valMulti}}" multiple v-ref="sel" size="8"></select-js>' +
    '<h4>Selected values:</h4><pre>{{ valMulti | jsonly }}</pre></div>',

  data: {
    val: undefined,
    valMulti: undefined,
    opts: [
      { text: 'the string "1"', value: "1" },
      { text: 'the number 1', value: 1 },
      { text: 'an object', value: {prop: 'x'} },
      { text: 'null', value: null },
      { text: 'NaN', value: NaN },
      { text: 'Infinity', value: -Infinity }
    ]
  },

  filters: {
    jsonly: function(value) {
      return JSON.stringify(value, revealType, 2)
    }
  },

  components: {
    'select-js': Select
  }

})

function revealType(k,v){
  if (Number.isNaN(v)) return '<NaN>'
  if (v === 'undefined') return '<undefined>'
  if (v === Number.POSITIVE_INFINITY) return '<Infinity>'
  if (v === Number.NEGATIVE_INFINITY) return '<-Infinity>'
  return v
}

demo.$mount(document.body.appendChild(document.createElement('div')))
module.exports = global.demo = demo
global.Select = Select
