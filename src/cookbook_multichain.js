import { config } from 'dotenv';
config();;

import { PromptTemplate} from 'langchain/prompts';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { RunnableSequence } from "langchain/schema/runnable";
import { StringOutputParser } from "langchain/schema/output_parser";

async function main(){

    const model = new ChatOpenAI({})

    const outParser = new StringOutputParser();


    /**
     * 1번 프롬프트의 결과를 2번 프롬프트의 인자로 전달 해서 결과 얻기
     * 1.프롬프트 1 생성
     * 2. 프롬프트 2번 생성
     * 3. pipe를 이용해서 1번프롬프의 채인 생성
     * 4.  RunableSequence을 이용해서 2번 체인 생성
     * 5. 2번 체인 실행
     * 
     * /
     */
    
    const prompt1 = PromptTemplate.fromTemplate('What is the city {person} is from? Only respond with the name of the city.')

    const prompt2 = PromptTemplate.fromTemplate('What country is the city {city} in? Respond in {language}.')

    const chain = prompt1.pipe(model).pipe(outParser);

    // const result1 = await chain.invoke({
    //     person: "Obama"
    // })

    // console.log(result1);

    const chain2 = RunnableSequence.from([
        {
            city:chain,
            language: (input)=>input.language,
        },
        prompt2, 
        model, 
        outParser
    ]);


    try {

        const result2 =  await chain2.invoke(
            {
              person:"Obama",
              language:"Korean"
          })
          
          console.log("result2",result2);
        
    } catch (error) {

        console.log(error);
        
    }


    
}


main();


