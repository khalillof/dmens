import { DefaultController } from './default.controller.js';
import { Configuration, OpenAIApi } from "openai";
import { config } from '../../common/index.js';
export class AuthController extends DefaultController {
    // https://github.com/openai/openai-node
    // https://www.npmjs.com/package/openai
    // https://platform.openai.com/docs/guides/images/usage
    // https://platform.openai.com/examples
    constructor(svc) {
        super(svc);
        const configuration = new Configuration({
            organization: "YOUR_ORG_ID",
            apiKey: 'process.env.OPENAI_API_KEY'
        });
        this.openai = new OpenAIApi(configuration);
        // const response = openai.listEngines();
    }
    openai;
    async createCompletion(text) {
        const res = await this.openai.createCompletion({
            model: "text-davinci-003",
            prompt: text || "Say this is a test",
            temperature: 0,
            max_tokens: 7,
        });
        return res;
    }
    async createImage(text) {
        const response = this.openai.createImage(prompt = "a white siamese cat", n = 1, size = "1024x1024");
        image_url = response['data'][0]['url'];
    }
    /**
  The image generations endpoint allows you to create an original image given a text prompt.
  Generated images can have a size of 256x256, 512x512, or 1024x1024 pixels. Smaller sizes are faster to generate.
   You can request 1-10 images at a time using the n parameter.
     */
    async secure(req, res, next) {
        const data = config.getSecret(req.query['api']);
        this.responce(res).data(data);
    }
}
