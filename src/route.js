import { config } from "dotenv";
config();


import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { RunnableBranch, RunnableSequence } from "langchain/schema/runnable";




const model = new ChatOpenAI({
  temperature: 0.9,
  modelName: "gpt-3.5-turbo"});




async function main(){

  const promptTemplate = PromptTemplate.fromTemplate(
    `Given the user question below, classify it as either being about \`LangChain\`, \`Anthropic\`, or \`Other\`.
                                     
    Do not respond with more than one word.
    
    <question>
    {question}
    </question>
    
    Classification:`)
  

const classificationChain = RunnableSequence.from([
  promptTemplate,
  model,
  new StringOutputParser(),
]);



const classificationChainResult = await classificationChain.invoke({
  question: "how do I call Longchain?",
});
console.log(classificationChainResult);


const langChainChain = PromptTemplate.fromTemplate(
  `You are an expert in langchain.
Always answer questions starting with "As Harrison Chase told me".
Respond to the following question:

Question: {question}
Answer:`
).pipe(model);

const anthropicChain = PromptTemplate.fromTemplate(
  `You are an expert in anthropic. \
Always answer questions starting with "As Dario Amodei told me". \
Respond to the following question:

Question: {question}
Answer:`
).pipe(model);

const generalChain = PromptTemplate.fromTemplate(
  `Respond to the following question:

Question: {question}
Answer:`
).pipe(model);


const branch = RunnableBranch.from([
  [ x => x.topic.toLowerCase().includes("anthropic"),anthropicChain],
  [(x) => x.topic.toLowerCase().includes("langchain"),langChainChain],
generalChain
]
);

const fullChain = RunnableSequence.from([
  {
    topic: classificationChain,
    question: (input) => input.question,
  },
  branch,
]);

const result1 = await fullChain.invoke({
  question: "how do I use Anthropic?",
});

console.log(result1);



}



main()