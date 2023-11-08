import { IConfigProps, IForm, IElement } from "../../interfaces/index.js";
import { ConfigProps } from "../index.js";
import { Svc } from '../../common/index.js'

export interface ILable {
    label: string,
    htmlFor: string,
    isRadioCheckBox?: boolean
}

export interface IFormVarient {
    children: any,
    isInputGroup?: boolean,
    isRadioCheckBox?: boolean,
    label?: ILable,
    icon?: string
}

export class Form implements IForm {

    constructor(props: IConfigProps) {
        if (!(props instanceof ConfigProps))
            throw new Error('Form class require instance of configProp class')

        this.name = props.name;

        this.elements = {}

    }

    name: string
    elements: Record<string, [Record<string, any>, Record<string, any>]>

  async  genElements(schemaObj: Record<string, any>) {
         
        for (let [key, value] of Object.entries(schemaObj)) {
            let tagname = value['tagname'];

            if (typeof value === 'object' && tagname) {

                switch (tagname) {
                    case "input":
                        if (value['inputtype']) {
                            this.addElemLable(key, value, { type: value['inputtype'] })
                        } else {
                           
                            let type = { type:  (('Boolean boolean'.indexOf(value.type) !==-1) ?  'checkbox': 'text') };
                            this.addElemLable(key, value, type)
                        }

                        break;
                    case "select":
                        let options: Record<string, any>[] = []

                        let { optionkey, ref } = value;

                        if (optionkey && ref && Svc.db.exist(ref)) {
                            
                            options =  (await Svc.db.get(ref)!.model!.find() || []).map((item: any, i: number) => { return { tagName: 'option', key: i, title: item[optionkey], value: item._id.toString() } });

                            this.addElemLable(key, value, { options });
                        } else {
                            this.addElemLable(key, value);
                        }
                        break;
                   // case "textarea":
                    //    let style = {minHeight: "200px"};
                    //    this.addElemLable(key, {style,...value})
                    //    break;
                    default:
                        this.addElemLable(key, value)
                        break;
                }
            }
        }
      
    }

    private addElemLable(key: string, elm: IElement, override?: Record<string, any>) {
        let element = { ...this.cleanObj(elm), id: key, ...override }
        let lable = { title: (element.ariaLabel ?? key),'aria-valuetext':(element.ariaLabel ?? key), htmlFor: (element.id ?? key), className: (element.type && element.type === "checkbox") ? "form-check-lable" : "form-lable" }

        this.elements[key] = [element, lable];
    }

    private cleanObj(obj: any, type: boolean = true) {

        for (let [key, value] of Object.entries(obj)) {

            if (type && isIn('type unique lowercase uppercase ref autopopulate inputtype', key)) {
                delete obj[key]
            }
            else if (isIn('unique lowercase uppercase ref autopopulate inputtype', key)) {
                delete obj[key]
            }
        }
        return obj;
    }

}

export const isIn = (srcText: string, item: string) => srcText.indexOf(item) !== -1;

export const isTag = function (tagename: string) {
    let _isTag = (tag: string) => isIn(tag, tagename)

    return {
        input: _isTag('text checkbox radio, date'),
        radioCheckbox: _isTag('checkbox radio '),
        checkbox: _isTag('checkbox'),
        radio: _isTag('radio'),
        select: _isTag('select'),
        taxtArea: _isTag('textarea'),
    }
}
export function Label(props: ILable) {
    const { label, htmlFor, isRadioCheckBox } = props;
    return `<label className=${(isRadioCheckBox ? "form-check-lable" : "form-lable")} for=${htmlFor}> ${label}:</label>`
}

export function FormVarient(props: IFormVarient) {
    const { isInputGroup, isRadioCheckBox, label, icon, children } = props;
    let _class = isRadioCheckBox ? "form-check" : (isInputGroup ? "input-group" : "form-floating");

    return `<div className=${_class + " mb-3"} >
        ${children}
        ${(isRadioCheckBox || !isInputGroup) && label && Label({ isRadioCheckBox, ...label })}
        ${(isInputGroup && icon) && '<span className="input-group-text"><i className=' + icon + '></i> </span>'}
    </div>`
}


