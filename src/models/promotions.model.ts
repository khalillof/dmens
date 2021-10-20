

export interface Promotion {
    name: string;
    image: string;
    label: string;
    price: string;
    featured: boolean;
    descriptions: string;
}

export const PromSchema = {

    name: {
        type: String,
        required: true,
        unique: true
    },
    descriptions: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: String,
        required: true,
        default: '0'
    },
    featured: {
        type: Boolean,
        default:false      
    }
};


