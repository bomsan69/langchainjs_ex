import { config } from "dotenv";
config();

import {OpenAI} from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage,SystemMessage,AIMessage } from "langchain/schema";


const { OPENAI_API_KEY } = process.env.OPENAI_API_KEY;

const llm = new OpenAI({
    openAIApiKey: OPENAI_API_KEY,
    temperature: 0.9,
    modelName: "gpt-3.5-turbo",
    maxTokens: 1000,
});

const chatModel = new ChatOpenAI();


async function main(){


    const prompt=`
     Respond to the following positive review for Rock 21 Karaoke in Palisades Park in a professional manner. The respond should within 4 sentences and do not have any hashtags #. The response should be in COMPLETE sentences and start with thank you statement. Please do not forget to mention the name of the business and location.Do NOT include any irrelevant content and/or statement:
     I’ve been coming to this Karaoke bar for sometime now and every-time I come they never fail to amaze me. The food is always hot and yummy. The service is spectacular the waiters come to check on you every so often. The bar is fully stocked! You never have to worry about feeling forgotten. A ton of music to choose from and they even have YouTube music. When you come here you know you’re in for a great time.
     `


    const text=`I’ve been coming to this Karaoke bar for sometime now and every-time I come they never fail to amaze me. The food is always hot and yummy. The service is spectacular the waiters come to check on you every so often. The bar is fully stocked! You never have to worry about feeling forgotten. A ton of music to choose from and they even have YouTube music. When you come here you know you’re in for a great time.`
    const system_text="You are a customer service expert in the restaurant business.";
    const ai_text="Respond to the following positive review for Rock 21 Karaoke in Palisades Park in a professional manner. The respond should within 4 sentences and do not have any hashtags #. The response should be in COMPLETE sentences and start with thank you statement. Please do not forget to mention the name of the business and location.Do NOT include any irrelevant content and/or statement:"

    const user_messages= new HumanMessage(
        {
            role: "user",
            content: text
        }
    );
    const system_messages= new SystemMessage(
        {
            role: "system",
            content: system_text
        }
    );

    const ai_messages= new AIMessage(
        {
            role: "assistant",
            content: ai_text
        }
    );

    const messages=[user_messages,system_messages,ai_messages];


    const llmResult =  await llm.predict(prompt);
    console.log("llm result:",llmResult+"\n\n\n");


    const chatResult = await chatModel.predict(prompt);
    console.log("chat result:",chatResult+"\n\n\n");


    const llmResult2 =  await llm.predictMessages(messages);
    console.log("llm result2:",llmResult2);

    console.log("\n\n\n");

    const chatResult2 = await chatModel.predictMessages(messages);
    console.log("chat result2:",chatResult2);

}


main()