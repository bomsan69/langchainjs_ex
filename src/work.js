import { config } from "dotenv";
config();

import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { StringOutputParser } from "langchain/schema/output_parser";
import {RunnablePassthrough,RunnableSequence} from "langchain/schema/runnable";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { TextLoader } from "langchain/document_loaders/fs/text";



const model = new ChatOpenAI({
  temperature: 0.9,
  modelName: "gpt-3.5-turbo"});

/*
RunnableMaps를 사용하면 여러 개의 런너블을 병렬로 실행하고 이러한 런너블의 출력을 맵으로 반환할 수 있습니다.
*/

async function main(){

  const loader = new TextLoader("./src/text.txt");
 const docs = await loader.load();

 console.log(docs);



  const vectorstore = await HNSWLib.fromDocuments(
  docs,
  new OpenAIEmbeddings()
  );

  console.log(vectorstore)


  const retriever = vectorstore.asRetriever();


  console.log("retriever")

  const template = `Answer the question based only on the following context:
 {context}

 Question: {question}`;





const prompt = PromptTemplate.fromTemplate(template);

console.log(prompt)

const formatDocs = (docs) => docs.map((doc) => doc.pageContent);




const retrievalChain = RunnableSequence.from([
  { context: retriever.pipe(formatDocs), question: new RunnablePassthrough() },
  prompt,
  model,
  new StringOutputParser(),
]);




const result = await retrievalChain.invoke(
  "what is James's hobby?",
);

console.log("result",result);

}

main()