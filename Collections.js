(function(global) {
    'use strict';
    global.Collection = function(items) {
        this.length = 0;
        this._data = [];
        this.listeners = {
            'get': [],
            'set': [],
            'change': [],
            'remove': []
        };
        if (this.isArray(items)) {
            this._data = items;
            this.length = this._data.length;
        } else {
            for (var i = items - 1; i >= 0; i--) {
                this._data.push(0);
            };
        }
    };
    global.Collection.prototype.isArray = function(data) {
        return data.constructor.toString().indexOf("Array") > -1;
    };
    global.Collection.prototype.fireEvent = function(event, data) {
        if (!this.listeners[event]) {
            return;
        }
        var ls = this.listeners[event];
        for (var i = ls.length - 1; i >= 0; i--) {
            ls[i].apply(this, data);
        };
    };
    global.Collection.prototype.getItem = function(index) {
        this.fireEvent('get', [index]);
        return this._data[index];
    };
    global.Collection.prototype.setItem = function(index, data) {
        if (this._data[index] === 'undefined') {
            this.fireEvent('set', [index, data]);
        } else {
            this.fireEvent('change', [index, data]);
        }
        this.length = this._data.length;
        return this._data[index];
    };
    global.Collection.prototype.push = function(data) {
        var i = this._data.push(data);
        this.fireEvent('set', [i, data]);
        this.length = this._data.length;
        return i;
    };
    global.Collection.prototype.pop = function() {
        var item = this._data.pop(data);
        this.length = this._data.length;
        this.fireEvent('remove', [this.length, data]);
        return item;
    };
    global.Collection.prototype.removeItem = function(index) {
        this.fireEvent('remove', [index]);
        return this._data[index].splice(index, 1);
    };
    global.Collection.prototype.forEach = function(cb) {
        for (var i = this._data.length - 1; i >= 0; i--) {
            cb && cb.apply && cb.apply(this, [this._data[i]]);
        };
    };
    global.Collection.prototype.addEventListener = function(event, handler, context) {
        if (!this.listeners[event]) {
            throw new Error('there is no event ' + event);
        }
        context = context || this;
        var ihandler = function() {
            handler.apply(context, arguments);
        }
        return this.listeners[event].push(ihandler);
    };
    global.Collection.prototype.removeEventListener = function(event, index) {
        this.listeners[event] && this.listeners[event][index] && this.listeners[event].splice(index, 1);
    };
})(this)