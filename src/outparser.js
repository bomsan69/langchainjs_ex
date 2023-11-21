import { config } from "dotenv";
config();

import {OpenAI} from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage,SystemMessage} from "langchain/schema";
import { PromptTemplate,ChatPromptTemplate } from "langchain/prompts";
import { BaseOutputParser } from "langchain/schema/output_parser";


const { OPENAI_API_KEY } = process.env.OPENAI_API_KEY;

const llm = new OpenAI({
    openAIApiKey: OPENAI_API_KEY,
    temperature: 0.9,
    modelName: "gpt-3.5-turbo",
    maxTokens: 1000,
});

const chatModel = new ChatOpenAI();

class CommaSepratedListOutputParser extends BaseOutputParser{

  async parse(text) {
    return text.split(',').map((item) => {return item.trim()});
  }

}


async function main(){

  const template = `You are a helpful assistant who generates comma separated lists.
  A user will pass in a category, and you should generate 5 objects in that category in a comma separated list.
  ONLY return a comma separated list, and nothing more.`;
  
  const humanTemplate = "{text}";

  const chatPrompt = ChatPromptTemplate.fromMessages([
    ["system", template],
    ["human", humanTemplate],
  ]);
  
  const parser = new CommaSepratedListOutputParser();

  const chain = chatPrompt.pipe(chatModel).pipe(parser);

  const result = await chain.invoke({
    text: "big city in korea",
  })

  console.log(result);




   
}


main()