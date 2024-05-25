import { IModelConfig, IModelForm, IElement } from "../../interfaces/index.js";
import { ModelConfig } from "../index.js";
import { Store } from '../../services/index.js'

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


export class ModelForm implements IModelForm {

    constructor(props: IModelConfig) {
        if (!(props instanceof ModelConfig))
            throw new Error('Form class require instance of configProp class')

        this.name = props.name;

        this.elements = {}
        this.initialState ={}

    }

    name: string
    initialState: Record<string, any>;
    elements: Record<string, any>

  async  genElements(schemaObj: Record<string, any>) {
         
        for (let [key, val] of Object.entries(schemaObj)) {
            let tagname = val['tag'];

            if (typeof val === 'object' && tagname) {

                switch (tagname) {
                    case "input":
                        let type = val['inputtype'] || (isIn('Boolean boolean',val.type) ?'checkbox': 'text');        
                        this.addElemLable(key, val,{type})

                        break;
                    case "select":
                        let options: Record<string, any>[] = []

                        let { optionkey, ref } = val;

                        if (optionkey && ref && Store.db.exist(ref)) {
                            
                            options =  (await Store.db.get(ref)!.model!.find() || []).map((item: any) =>  ({key: item._id.toString(), title: item[optionkey], value: item._id.toString()}) );
                            options.unshift({k:options.length+1 ,title:`Choose ${key}....` , disabled:true, defaultValue:""})
                          
                            this.addElemLable(key, val, { options });
                        } else {
                            this.addElemLable(key, val);
                        }
                        break;
                   // case "textarea":
                    //    let style = {minHeight: "200px"};
                    //    this.addElemLable(key, {style,...value})
                    //    break;
                    default:
                        this.addElemLable(key, val)
                        break;
                }
            }
        }
      
    }

    private addElemLable(key: string, elm: IElement, override?: Record<string, any>) {
        let element = { ...this.cleanObj(elm), id: key, ...override , name:key}
        this.elements[key] = element;
        this.initialState[key] =  "";
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



