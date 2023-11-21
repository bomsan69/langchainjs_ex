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
    `Given the user review below, classify it as either being about \`Positive\`, \`Negative\`, or \`Other\`.
                                     
    Do not respond with more than one word.
    
    <review>
    {review}
    </review>
    
    Classification:`)
  

const classificationChain = RunnableSequence.from([
  promptTemplate,
  model,
  new StringOutputParser(),
]);


/*
const classificationChainResult = await classificationChain.invoke({
  review: "Smelled initially like urine when we sat down at our table. Our waitress checked on us very often; however, the food was mediocre. The sauces they had were very sweet to my liking. I wouldn’t go there again.",
});
console.log(classificationChainResult);

*/


  
  
  const PositiveChain = PromptTemplate.fromTemplate(
    `Respond to the following positive review for {customer} in {location} in a professional manner. 
     The respond should within 4 sentences and do not have any hashtags #. 
     The response should be in COMPLETE sentences and start with thank you statement. 
     Please do not forget to mention the name of the business and location. Do NOT include any irrelevant content and/or statement:
     
     Review:{review}
    
     Answer:
   `
  ).pipe(model);
  
  const NegetiveChain = PromptTemplate.fromTemplate(
    `Respond to the following negative review for {customer} in {location} in a professional manner to alleviate the customer's negative feelings. 
    The respond should within 4 sentences and do not have any hashtags #. The response should be in COMPLETE sentences and the voice should be polite and professional. 
    Please mention that we will implement further action to prevent similar issues:
    
    Review:{review}

    Answer:
   `
  ).pipe(model);
  
  const NormalChain = PromptTemplate.fromTemplate(
    `Respond to the following positive review for {customer} in {location} in a professional manner. 
    The respond should within 4 sentences and do not have any hashtags #. The response should be in COMPLETE sentences and start with thank you statement. Please do not forget to mention the name of the business and location. Do NOT include any irrelevant content and/or statement:
    Review:{review}
   
    Answer:
  `
  ).pipe(model);


  const branch = RunnableBranch.from([
    [ x => x.topic.toLowerCase().includes("positive"),PositiveChain],
    [(x) => x.topic.toLowerCase().includes("negative"),NegetiveChain],
    NormalChain
  ]
  
  );
  
  const fullChain = RunnableSequence.from([
    {
      topic: classificationChain,
      review: (input) => input.review,
      customer: (input) => input.customer,
      location: (input) => input.location,
    },
    branch,
  ]);
  
  const result1 = await fullChain.invoke({

    review: "I came here for the first time on a Saturday and we were seated within 5 minutes. The rice cakes were very good!",
    customer:"Rock 21 Karaoke",
    location:"Palisades Park"

})

  console.log(result1.content);

}

main()