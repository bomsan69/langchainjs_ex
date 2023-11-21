import { config } from 'dotenv';
config();

import { DataSource } from "typeorm";
import { SqlDatabase } from "langchain/sql_db";

import { PromptTemplate} from 'langchain/prompts';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
    RunnableSequence,
    RunnablePassthrough,
  } from "langchain/schema/runnable";
import { StringOutputParser } from "langchain/schema/output_parser";
  
const datasource = new DataSource({
  type: "sqlite",
  database: "Chinook.db",
});


async function main(){

  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: datasource,
  });

   const model = new ChatOpenAI({});

   const prompt = PromptTemplate.fromTemplate(`Based on the table schema below, write a SQL query that would answer the user's question:
   {schema}

   Question: {question}
   SQL Query:`

   );

const sqlQueryGeneratorChain = RunnableSequence.from([
  RunnablePassthrough.assign({
    schema: async () => db.getTableInfo(),
  }),
  prompt,
  model.bind({ stop: ["\nSQLResult:"] }),
  new StringOutputParser(),
]);

const result = await sqlQueryGeneratorChain.invoke({
  question: "Please change Jane Peacock's email address to james@boranet.net ",
});

console.log({
  result,
});

const finalResponsePrompt =
  PromptTemplate.fromTemplate(`Based on the table schema below, question, sql query, and sql response, write a natural language response:
{schema}

Question: {question}
SQL Query: {query}
SQL Response: {response}`);


const fullChain = RunnableSequence.from([
  RunnablePassthrough.assign({
    query: sqlQueryGeneratorChain,
  }),
  {
    schema: async () => db.getTableInfo(),
    question: (input) => input.question,
    query: (input) => input.query,
    response: (input) => db.run(input.query),
  },
  finalResponsePrompt,
  model,
]);

//Please update Jane Peacock's email to 'cjames@boranet.net '
//Tell me Jane Peacock's information

const finalResponse = await fullChain.invoke({
  question: "How many people do live in Calgary?",
});

console.log(finalResponse);
  

    
}


main();


