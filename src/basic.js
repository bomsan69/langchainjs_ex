import { config } from "dotenv";
import {OpenAI} from "langchain/llms/openai";

config();
const { OPENAI_API_KEY } = process.env.OPENAI_API_KEY;

const llm = new OpenAI({openAIApiKey: OPENAI_API_KEY});


async function main(){


    const prompt=`Respond to the following positive review for Rock 21 Karaoke in Palisades Park in a professional manner. The respond should within 4 sentences and do not have any hashtags #. The response should be in COMPLETE sentences and start with thank you statement. Please do not forget to mention the name of the business and location. Do NOT include any irrelevant content and/or statement:I’ve been coming to this Karaoke bar for sometime now and every-time I come they never fail to amaze me. The food is always hot and yummy. The service is spectacular the waiters come to check on you every so often. The bar is fully stocked! You never have to worry about feeling forgotten. A ton of music to choose from and they even have YouTube music. When you come here you know you’re in for a great time.`
    const res = await llm.call(prompt);
    console.log(res);

}


main()