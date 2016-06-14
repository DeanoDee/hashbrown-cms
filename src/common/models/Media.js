'use strict';

// Libs
let path = require('path');

let Entity = require('./Entity');

/**
 * The base class for all Media objects
 */
class Media extends Entity {
    structure() {
        this.def(String, 'id');
        this.def(String, 'name');
        this.def(String, 'url');
    }

    /**
     * Read from file path
     *
     * @param {String} filePath
     */
    readFromFilePath(filePath) {
        let name = path.basename(filePath);
        let id = filePath;
       
        // Trim file path for id 
        id = id.replace('/' + name, '');
        id = id.substring(id.lastIndexOf('/') + 1);
        
        // Remove file extension
        name = name.replace(/\.[^/.]+$/, '');
     
        this.id = id;
        this.name = name;
        this.url = '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + id;
    }

    /**
     * Creates a new Media object
     *
     * @param {Object} file
     *
     * @return {Media} media
     */
    static create(file) {
        let media = new Media({
            id: Entity.createId()
        });
    
        return media;
    }
}

module.exports = Media;
