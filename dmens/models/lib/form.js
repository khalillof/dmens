import { ConfigProps } from "../index.js";
import { Svc } from '../../common/index.js';
export class Form {
    constructor(props) {
        if (!(props instanceof ConfigProps))
            throw new Error('Form class require instance of configProp class');
        const { name, routeName } = props;
        this.formId = name;
        this.formName = name;
        this.routeName = '/api' + routeName;
        this.elements = {};
    }
    formId;
    formName;
    routeName;
    elements;
    async genElements(config) {
        for (let [key, value] of Object.entries(config.schemaObj)) {
            let tagName = value['tagName'];
            if (typeof value === 'object' && tagName) {
                switch (tagName) {
                    case "input":
                        if (value['inputtype']) {
                            this.addElemLable(key, value, { type: value['inputtype'] });
                        }
                        else {
                            let type = { type: typeof value['type'] === 'string' ? 'text' : 'checkbox' };
                            this.addElemLable(key, value, type);
                        }
                        break;
                    case "select":
                        let options = [];
                        let { optionkey, ref } = value;
                        if (optionkey && ref && Svc.db.exist(ref)) {
                            options = (await Svc.db.get(ref)?.model?.find()).map((item, i) => { return { tagName: 'option', key: i, title: item[optionkey], value: item._id.toString() }; });
                            this.addElemLable(key, value, { options });
                        }
                        else {
                            this.addElemLable(key, value);
                        }
                        break;
                    default:
                        this.addElemLable(key, value);
                        break;
                }
            }
        }
        return this;
    }
    addElemLable(key, elm, override) {
        let element = { ...this.cleanObj(elm), id: key, ...override };
        let lable = { tagName: 'lable', title: (element.ariaLabel ?? key), htmlFor: (element.id ?? key), className: (element.type && element.type === "checkbox") ? "form-check-lable" : "form-lable" };
        this.elements[key] = [element, lable];
    }
    cleanObj(obj, type = true) {
        for (let [key, value] of Object.entries(obj)) {
            if (type && isIn('type unique lowercase uppercase ref autopopulate inputtype', key)) {
                delete obj[key];
            }
            else if (isIn('unique lowercase uppercase ref autopopulate inputtype', key)) {
                delete obj[key];
            }
        }
        return obj;
    }
}
export const isIn = (srcText, item) => srcText.indexOf(item) !== -1;
export const isTag = function (tagename) {
    let _isTag = (tag) => isIn(tag, tagename);
    return {
        input: _isTag('text checkbox radio, date'),
        radioCheckbox: _isTag('checkbox radio '),
        checkbox: _isTag('checkbox'),
        radio: _isTag('radio'),
        select: _isTag('select'),
        taxtArea: _isTag('textarea'),
    };
};
export function Label(props) {
    const { label, htmlFor, isRadioCheckBox } = props;
    return `<label className=${(isRadioCheckBox ? "form-check-lable" : "form-lable")} for=${htmlFor}> ${label}:</label>`;
}
export function FormVarient(props) {
    const { isInputGroup, isRadioCheckBox, label, icon, children } = props;
    let _class = isRadioCheckBox ? "form-check" : (isInputGroup ? "input-group" : "form-floating");
    return `<div className=${_class + " mb-3"} >
        ${children}
        ${(isRadioCheckBox || !isInputGroup) && label && Label({ isRadioCheckBox, ...label })}
        ${(isInputGroup && icon) && '<span className="input-group-text"><i className=' + icon + '></i> </span>'}
    </div>`;
}
