"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTag = exports.isIn = exports.ModelForm = void 0;
const index_js_1 = require("../index.js");
const index_js_2 = require("../../services/index.js");
class ModelForm {
    constructor(props) {
        if (!(props instanceof index_js_1.ModelConfig))
            throw new Error('Form class require instance of configProp class');
        this.name = props.name;
        this.elements = {};
        this.initialState = {};
    }
    name;
    initialState;
    elements;
    async genElements(schemaObj) {
        for (let [key, val] of Object.entries(schemaObj)) {
            let tagname = val['tag'];
            if (typeof val === 'object' && tagname) {
                switch (tagname) {
                    case "input":
                        let type = val['inputtype'] || ((0, exports.isIn)('Boolean boolean', val.type) ? 'checkbox' : 'text');
                        this.addElemLable(key, val, { type });
                        break;
                    case "select":
                        let options = [];
                        let { optionkey, ref } = val;
                        if (optionkey && ref && index_js_2.Store.db.exist(ref)) {
                            options = (await index_js_2.Store.db.get(ref).model.find() || []).map((item) => ({ key: item._id.toString(), title: item[optionkey], value: item._id.toString() }));
                            options.unshift({ k: options.length + 1, title: `Choose ${key}....`, disabled: true, defaultValue: "" });
                            this.addElemLable(key, val, { options });
                        }
                        else {
                            this.addElemLable(key, val);
                        }
                        break;
                    // case "textarea":
                    //    let style = {minHeight: "200px"};
                    //    this.addElemLable(key, {style,...value})
                    //    break;
                    default:
                        this.addElemLable(key, val);
                        break;
                }
            }
        }
    }
    addElemLable(key, elm, override) {
        let element = { ...this.cleanObj(elm), id: key, ...override, name: key };
        this.elements[key] = element;
        this.initialState[key] = "";
    }
    cleanObj(obj, type = true) {
        for (let [key, value] of Object.entries(obj)) {
            if (type && (0, exports.isIn)('type unique lowercase uppercase ref autopopulate inputtype', key)) {
                delete obj[key];
            }
            else if ((0, exports.isIn)('unique lowercase uppercase ref autopopulate inputtype', key)) {
                delete obj[key];
            }
        }
        return obj;
    }
}
exports.ModelForm = ModelForm;
const isIn = (srcText, item) => srcText.indexOf(item) !== -1;
exports.isIn = isIn;
const isTag = function (tagename) {
    let _isTag = (tag) => (0, exports.isIn)(tag, tagename);
    return {
        input: _isTag('text checkbox radio, date'),
        radioCheckbox: _isTag('checkbox radio '),
        checkbox: _isTag('checkbox'),
        radio: _isTag('radio'),
        select: _isTag('select'),
        taxtArea: _isTag('textarea'),
    };
};
exports.isTag = isTag;
