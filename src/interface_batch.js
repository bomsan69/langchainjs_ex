import { config } from "dotenv";
config();


import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";



const chatModel = new ChatOpenAI({
  temperature: 0.9,
  modelName: "gpt-3.5-turbo"});




async function main(){

  const biblePromptTemplate = PromptTemplate.fromTemplate(
    "{topic}에 관한 성경 구절을 추천해 주세요"
  );

  const chain = biblePromptTemplate.pipe(chatModel);

  const result = await chain.batch([
    {topic: "고난"},
    {topic: "정욕"},
    {topic: "행복"},
  ]);
  
  console.log(result);


}


main()