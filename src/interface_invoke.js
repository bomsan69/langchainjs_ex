import { config } from "dotenv";
config();


import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";


const chatModel = new ChatOpenAI({
  temperature: 0.9,
  modelName: "gpt-3.5-turbo"});




async function main(){

  const biblePromptTemplate = PromptTemplate.fromTemplate(
    "{topic}에 관한 성경 구절을 추천해 주세요"
  );

  const jokeTemplate = PromptTemplate.fromTemplate(
    "Tell me a joke about {topic}"
  );

 const chain = RunnableSequence.from([jokeTemplate,chatModel]);

 const result = await chain.invoke({
  topic: "Poor",
 });

 console.log(result.content);

   
}


main()