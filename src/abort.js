import { config } from "dotenv";
config();

import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";

const controller = new AbortController();



const llm = new ChatOpenAI({
  temperature: 0.9,
  modelName: "gpt-3.5-turbo"});


async function main(){

  const model = llm.bind({
    signal: controller.signal
  });

  const prompt = PromptTemplate.fromTemplate("Please write 500 words about {topic}");

  const chain = prompt.pipe(llm);

  setTimeout(() => {
    controller.abort();
  }, 3000);

  try {
    // Call the chain with the inputs and a callback for the streamed tokens
    const stream = await chain.stream({ topic: "Bonobos" });
  
    for await (const chunk of stream) {
      console.log(chunk);
    }
  } catch (e) {
    console.log(e);
    // Error: Cancel: canceled
  }


 
}



main()