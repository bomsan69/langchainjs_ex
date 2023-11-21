import { config } from "dotenv";
config();

import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { RunnableMap } from "langchain/schema/runnable";




const model = new ChatOpenAI({
  temperature: 0.9,
  modelName: "gpt-3.5-turbo"});

/*
RunnableMaps를 사용하면 여러 개의 런너블을 병렬로 실행하고 이러한 런너블의 출력을 맵으로 반환할 수 있습니다.
*/

async function main(){

const jokeChain = PromptTemplate.fromTemplate(
  "{topic}에 관해서 성경구절 1개를 추천해 주세요"
).pipe(model);

const poemChain = PromptTemplate.fromTemplate(
  "{topic}에 관해서 2줄의 시를 작성해 주세요"
).pipe(model);

const mapChain = RunnableMap.from({
  joke: jokeChain,
  poem: poemChain,
});

const result = await mapChain.invoke({
  topic: "Happy",
});

console.log(result.joke.content);
console.log(result.poem.content);
 

 
}



main()