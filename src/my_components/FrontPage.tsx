import { Text, Box, Button, Center, Input, Stack, Spinner, HStack, Flex } from '@chakra-ui/react'
import { Field } from "@/components/ui/field"
import { useForm } from "react-hook-form"
import axios from 'axios'
import { useEffect, useState } from 'react'
interface FormValues {
  url: string
  id: number
  instruction: string
}

interface PromptData {
  ID: number
  Prompt: string
  URL: string
}

const FrontPage = () => {
  
  const [myprompt, setMyPrompt] = useState("");
  const [postingerror, setPostingerror] = useState("");
  const [retrivingerror, setRetrivingerror] = useState("")
  const [posteddata, setPosteddata] = useState("")
  const [webhookSuccess, SetWebhookSuccess] = useState("")
  const [postingErrorTracker, setPostingErrorTracker] = useState(false)
  const [requestCanceled, setRequestCanceled] = useState(false)
  const [instruction, setInstruction] = useState("")
  
  const [uniqueCode, setUniqueCode] = useState<number>()

  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = handleSubmit((data,event)=> {
    event?.preventDefault;
    if (data.url === posteddata)
      return
    setPosteddata(data.url)
    
    setUniqueCode(data.id)
    setInstruction(data.instruction)
    
    setMyPrompt("")
    setRequestCanceled(false)
    setPostingErrorTracker(false)

   });

   const handleReset = ()=> {
    setPosteddata("")
    setMyPrompt("")
    setRequestCanceled(true)
    setInstruction("")
   }
   const resetError = ()=> setPostingerror("")



   function handleWebhookSuccess() {
    
    return SetWebhookSuccess(posteddata)
   }
  
  

    useEffect(()=>{
      

      if (posteddata === "")
        return

       
      
      axios.post("https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTZlMDYzMDA0MzA1MjZkNTUzYzUxMzQi_pc", {link: posteddata, UniqueCode: uniqueCode, Instruction: instruction}, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
      .then(()=> {
        triggerCall();
        }
      )
      .catch((error)=> {
        setPostingerror(error.message)
        setPostingErrorTracker(true)
        setTimeout(resetError, 5000);
      }
      )
    }, [posteddata])

  useEffect(()=>{
     

      if (webhookSuccess === "" || postingErrorTracker || requestCanceled)
        return
      axios.get<PromptData[]>("https://script.google.com/macros/s/AKfycbwIFqq7T0bbLa_ktXeNWciekJ-M7OZo0N9mUV1SexKghGzWNL0y1Yr5heWjXK56Z3dj/exec")
      .then((res)=> {
        res.data.forEach((data)=>{
          if (data.URL === posteddata) {
              setMyPrompt(data.Prompt)
              
          }
          else
          setMyPrompt("Ops.. Algo deu errado. Entre em contato com o Mundo Dos Bots para investigar esse problema. Enquanto isso, você poderá tentar sua solicitação novamente depois de algum tempo")
          
          }
        )
      }
      )
      .catch((error)=> {
        setRetrivingerror(error.message)
        //setTimeout(resetError, 5000);
      }
      )
    }, [webhookSuccess])

    async function triggerCall() {
      await sleep(40);
      handleWebhookSuccess()
      }
    
    async function sleep(seconds: number) {
      return new Promise((resolve) => {
        setTimeout(resolve, seconds*1000);
      })
    }
  return (
    <Center  marginTop="10px" maxW="100vw">
    <Stack gap="4" align="center" width="100%">
       <Box rounded="md" background="white" width="80%"  padding="4" color="#2a2955" >
       <form onSubmit={onSubmit}>
      <Stack gap="4" align="center" maxW="100%">
        <Field
          label="Insira O URL Do Site (incluindo https://)"
          invalid={!!errors.url}
          errorText={errors.url?.message}
         
        >
          <Input placeholder='https://mundodosbots.com.br'
            {...register("url", { required: "Insira um URL de site válido" })}
          />
          </Field>
        <Field
          label="Insira Um ID Exclusivo Para Referenciar Sua Solicitação"
          invalid={!!errors.id}
          errorText={errors.id?.message}
        >
          <Input placeholder='1234567890'
            {...register("id", { required: "Insira um ID exclusivo para referenciar sua solicitação... pode ser qualquer número" })}
          />
        </Field>

        <Field
          label="Quais dados você gostaria de extrair"
          invalid={!!errors.instruction}
          errorText={errors.instruction?.message}
        >
          <Input placeholder='Descreva as informações/dados que você gostaria de extrair'
            {...register("instruction", { required: "Você precisa descrever as informações/dados que gostaria de extrair" })}
          />
        </Field>

        <HStack>
       <Button type="submit" bg="#212332" color="#ff9703"  _hover={{ bg: "#ff9703", color:"#212332"}}>Gerar Prompt</Button>
       <Button type="reset" bg="#212332" color="#ff9703"  _hover={{ bg: "#ff9703", color:"#212332"}} onClick={handleReset}>Reiniciar</Button>
       </HStack>
      </Stack>
    </form>
    </Box>
    { postingerror && <Box rounded="md" background="white" width="90%"  padding="4" color="#2a2955">
      <Text textStyle="md"  fontWeight="bold">{postingerror}</Text>
    </Box>}

    { retrivingerror && <Box rounded="md" background="white" width="90%"  padding="4" color="#2a2955">
      <Text textStyle="md"  fontWeight="bold">{retrivingerror}</Text>
    </Box>}

      
    { posteddata && <Box rounded="md" background="white" width="90%"  padding="4" color="#2a2955">
      <Flex gap="4" justify="space-between"> 
      <Text textStyle="md"  fontWeight="bold">{posteddata} </Text>
      {!prompt && <Spinner color="#ff9702" borderWidth="2px" size= "sm" />}
      </Flex>
    </Box>}
    {posteddata && !prompt &&  <Text textStyle="sm" color="#ff9703">Carregando.... isso pode levar até 35 segundos</Text>}
    
   
    {myprompt && <Box rounded="md" background="white" width="90%"  padding="4" color="#2a2955" >
      <Text textStyle="md">{myprompt}
      </Text>
    </Box>}
    {posteddata && !myprompt && <Spinner color="#ff9702" borderWidth="10px" size= "xl" />}
  
    </Stack>
    </Center>
  )
}

export default FrontPage
