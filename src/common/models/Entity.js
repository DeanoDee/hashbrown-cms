'use strict';

let crypto = require('crypto');

/**
 * The base class for everything
 */
class Entity {
    /**
     * Constructs an entity
     *
     * @param {Object} properties
     */
    constructor(properties) {
        this.structure();

        Object.seal(this);

        for(let k in properties) {
            try {
                this[k] = properties[k] || this[k];
            
            } catch(e) {
                debug.warning(e, this);
            }
        }
    }

    /**
     * Sets up a structure before sealing the object
     */
    structure() {

    }

    /**
     * Generates a new random id
     *
     * @returns {String} id
     */
    static createId() {
        return crypto.randomBytes(20).toString('hex');
    }

    /**
     * TODO: Deprecate this method
     */
    getFields() {
        return this.getObject();
    }

    /**
     * Gets a copy of every field in this object as a mutable object
     *
     * @returns {Object} object
     */
    getObject() {
        let fields = {};

        for(let k in this) {
            let v = this[k];

            if(typeof v !== 'function') {
                fields[k] = v;
            }
        }

        return fields;
    }

    /**
     * Defines a type safe member variable
     *
     * @param {String} type
     * @param {String} name
     * @param {Anything} defaultValue
     */
    def(type, name, defaultValue) {
        if(typeof type !== 'function') {
            throw new TypeError('Parameter \'type\' cannot be of type \'' + (typeof type) + '\'.');
        }
        
        if(typeof name !== 'string') {
            throw new TypeError('Parameter \'name\' cannot be of type \'' + (typeof name) + '\'.');
        }

        if(!defaultValue || typeof defaultValue === 'undefined') {
            switch(type) {
                case String:
                    defaultValue = '';
                    break;

                case Number:
                    defaultValue = 0;
                    break;

                case Date:
                    defaultValue = new Date();
                    break;

                case Boolean:
                    defaultValue = false;
                    break;

                default:
                    defaultValue = null;
                    break;
            }
        }

        let thisValue = defaultValue;
        let thisType = type;

        Object.defineProperty(this, name, {
            enumerable: true,
            get: () => {
                return thisValue;
            },
            set: (thatValue) => {
                // Special case for Booleans
                // This exists because of MongoDB data tends to come back as strings instead of booleans
                if(thisType == Boolean) {
                    if(!thatValue) {
                        thatValue = false;

                    } else if(thatValue.constructor == String) {
                        if(thatValue === 'false') {
                            thatValue = false;
                        } else if(thatValue === 'true') {
                            thatValue = true;
                        }
                    }
                }

                if(thatValue) {
                    let thatType = thatValue.constructor;

                    if(thisType !== thatType) {
                        throw new TypeError(this.constructor.name + '.' + name + ' is of type \'' + thisType.name + '\' and cannot implicitly be converted to \'' + thatType.name + '\'.');
                    } else {
                        thisValue = thatValue; 
                    }
                
                } else {
                    thisValue = defaultValue;
                
                }
            }
        });
    }
}

module.exports = Entity;
