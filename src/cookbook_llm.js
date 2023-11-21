import { config } from 'dotenv';
config();;

import { PromptTemplate} from 'langchain/prompts';
import { ChatOpenAI } from 'langchain/chat_models/openai';


async function main(){

    const model = new ChatOpenAI({
        modelName: 'gpt-3.5-turbo',
        temperature: 0.9
    })

    const prompt = PromptTemplate.fromTemplate('Tell me a joke about {subject}.');

    const functionSchema =[
        {
            name:"joke",
            description:"joke",
            parameters:{
                type:"object",

                properties:{
                    setup:{
                        type:"string",
                        description:"the setup for joke"
                    },
                    punchline:{
                        type:"string",
                        description:"the punchline for joke"
                    }
                },

                required:["setup","punchline"]
            }
            

        },
        {
            name:"poem",
            description:"poem",
            parameters:{
                type:"object",

                properties:{
                    title:{
                        type:"string",
                        description:"poem title"
                    },
                    content:{
                        type:"string",
                        description:"poem content"
                    }
                },

                required:["title","content"]
            }
            

        },
    ]

    model.bind({
        functions:functionSchema,
        function_call:{name:'joke'}
    })

    const chain = prompt.pipe(model);

    const result = await chain.invoke({
        subject: "Happy"
    });



    console.log(result)

    




    
    
}


main();


