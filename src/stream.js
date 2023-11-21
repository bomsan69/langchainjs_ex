import { config } from "dotenv";
config();


import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";


const chatModel = new ChatOpenAI({
  temperature: 0.9,
  modelName: "gpt-3.5-turbo"});




async function main(){

  const promptTemplate = PromptTemplate.fromTemplate(
    "{topic}에 관한 성경 구절을 추천해 주세요"
  );

  const chain = promptTemplate.pipe(chatModel);

  const stream = await chain.stream({
    topic: "가난",
  });

  for await (const chunk of stream) {
    console.log(chunk?.content);
  }



   
}


main()