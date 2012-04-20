/*global define, module, exports*/
(function(root){
    'use strict';
    var base, Ctor, extend, inherits,
        toString = Object.prototype.toString,
        hasOwn = Object.prototype.hasOwnProperty,
        isObject = function(obj) {
            return (typeof obj !== 'undefined' &&
                    toString.call(obj) === '[object Object]');
        };

    base = function(){
        this.initialize.apply(this, arguments);
    };
    base.prototype = {
        initialize: function(){}
    };
    base.extend = function (protoProps, classProps) {
        var child = inherits(this, protoProps, classProps);
        child.extend = this.extend;
        return child;
    };
    extend = function(obj, source) {
        var prop, objProp, sourceProp;
        for (prop in source) {
            if (hasOwn.call(source, prop)) {
                objProp = obj[prop];
                sourceProp = source[prop];
                if (isObject(objProp) && isObject(sourceProp)) {
                    extend(objProp, sourceProp);
                }
                else {
                    if (typeof sourceProp === 'function') {
                        sourceProp.__name__ = prop;
                    }
                    obj[prop] = sourceProp;
                }
            }
        }
    };
    Ctor = function(){};
    inherits = function(parent, protoProps, classProps) {
        var child = (protoProps && protoProps.hasOwnProperty('constructor') ?
                     protoProps.constructor :
                     function() {return parent.apply(this, arguments);});
        extend(child, parent);
        Ctor.prototype = child.__super__ = parent.prototype;
        child.prototype = new Ctor();
        if (protoProps) {
            extend(child.prototype, protoProps);
        }
        if (classProps) {
            extend(child, classProps);
        }
        child.prototype.constructor = child;
        return child;
    };

    // CommonJS module is defined
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            // Export module
            module.exports = base;
        }
        exports.base = base;

    } else if (typeof define === 'function' && define.amd) {
        // Register as a named module with AMD.
        define(function() {
            return base;
        });

        // Integrate with Underscore.js
    } else if (typeof root.Class === 'undefined') {
        root.Class = base;
    }
})(this || window);
