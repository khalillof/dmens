

export interface Leader {
    name: string;
    image: string;
    designation: string;
    abbr: string;
    featured: boolean;
    description: string;
}

export const LeaderSchema = {
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        default: ''
    },
    abbr: {
        type: String,
        required: true,
        default: '0'
    },
    featured: {
        type: Boolean,
        default:false      
    },
    descriptions: {
        type: String,
        required: true
    }
};
