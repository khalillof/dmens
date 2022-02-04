import {IConstructor} from './types.config'

interface IActivatable {
    id: number;
    name: string;
}

class ClassA implements IActivatable {
    public id: number = 0;
    public name: string = '';
    public address: string = '';
    constructor(arg:any[]){

    }
}

class ClassB implements IActivatable {
    public id: number = 0;
    public name: string = '';
    public age: number = 0;
}

function activator<T extends IActivatable>(type: IConstructor<T>, ...arg:any[]): T {
   // if(arg)
    return new type(...arg);
    //return new type()
}

const classcc = activator(ClassA);
const classee = activator(ClassA, ['']);