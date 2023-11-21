import { config } from 'dotenv';
config();;

import { PromptTemplate} from 'langchain/prompts';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import {
    RunnableSequence,
    RunnablePassthrough,
  } from "langchain/schema/runnable";
  import { StringOutputParser } from "langchain/schema/output_parser";
  import { formatDocumentsAsString } from "langchain/util/document";

async function main(){

   const model = new ChatOpenAI({});

   const vectorStore = await HNSWLib.fromTexts(
    ["mitochondria is the powerhouse of the cell"],
    [{ id: 1 }],
    new OpenAIEmbeddings()
  );
  const retriever = vectorStore.asRetriever();

  console.log("retriever",retriever.pipe(formatDocumentsAsString),)

  const prompt =
  PromptTemplate.fromTemplate(`Answer the question based only on the following context:
{context}

Question: {question}`);

const chain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocumentsAsString),
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  new StringOutputParser(),
]);

const result = await chain.invoke("What is the powerhouse of the cell?");

console.log(result);


    
}


main();


