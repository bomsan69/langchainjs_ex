import { config } from "dotenv";
config();

import {OpenAI} from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage,SystemMessage} from "langchain/schema";
import { PromptTemplate,ChatPromptTemplate } from "langchain/prompts";


const { OPENAI_API_KEY } = process.env.OPENAI_API_KEY;

const llm = new OpenAI({
    openAIApiKey: OPENAI_API_KEY,
    temperature: 0.9,
    modelName: "gpt-3.5-turbo",
    maxTokens: 1000,
});

const chatModel = new ChatOpenAI();


async function main(){

/*
    const prompt=`
     Respond to the following positive review for Rock 21 Karaoke in Palisades Park in a professional manner. The respond should within 4 sentences and do not have any hashtags #. The response should be in COMPLETE sentences and start with thank you statement. Please do not forget to mention the name of the business and location.Do NOT include any irrelevant content and/or statement:
     I’ve been coming to this Karaoke bar for sometime now and every-time I come they never fail to amaze me. The food is always hot and yummy. The service is spectacular the waiters come to check on you every so often. The bar is fully stocked! You never have to worry about feeling forgotten. A ton of music to choose from and they even have YouTube music. When you come here you know you’re in for a great time.
     `
*/

const prompt = PromptTemplate.fromTemplate(
    `Respond to the following positive review for {customer} in {location} in a professional manner. 
     The respond should within 4 sentences and do not have any hashtags #. The response should be in COMPLETE sentences and start with thank you statement. 
     Please do not forget to mention the name of the business and location.Do NOT include any irrelevant content and/or statement:
     {review}
     `
)

const formatedPrompt = await prompt.format({
    customer:"Rock 21 Karaoke ",
    location:"Palisades Park",
    review:" I’ve been coming to this Karaoke bar for sometime now and every-time I come they never fail to amaze me. The food is always hot and yummy. The service is spectacular the waiters come to check on you every so often. The bar is fully stocked! You never have to worry about feeling forgotten. A ton of music to choose from and they even have YouTube music. When you come here you know you’re in for a great time."
})


    const llmResult =  await llm.predict(formatedPrompt);
    console.log("llm result:",llmResult+"\n\n\n");

    const template ="You are a helpful assistant that translates {input_language} into {output_language}.";
    const humanTemplate = "{text}";
  
  const chatPrompt = ChatPromptTemplate.fromMessages([
    ["system", template],
    ["human", humanTemplate],
  ]);
  
  const formattedChatPrompt = await chatPrompt.formatMessages({
    input_language: "English",
    output_language: "French",
    text: "I love programming.",
  });

    console.log(formattedChatPrompt);

    const chatResult =  await chatModel.predictMessages(formattedChatPrompt);
    console.log("chat result:",chatResult);





   
}


main()