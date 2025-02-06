import { Box, Button, Center, Input, Stack } from '@chakra-ui/react'
import { Field } from "@/components/ui/field"
import { useForm } from "react-hook-form"
import { FormEvent } from 'react'
interface FormValues {
  url: string
  
}

const FrontPage = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = handleSubmit((data:FormEvent) => console.log(data))

  return (
    <Center bg="#2a2955" h="100vh" maxW="100vw">
       <Box rounded="md" background="white" width="60%"  padding="4" color="#2a2955">
       <form onSubmit={onSubmit}>
      <Stack gap="4" align="center" maxW="100%">
        <Field
          label="Insira o URL do site"
          invalid={!!errors.url}
          errorText={errors.url?.message}
        >
          <Input placeholder='https://mundodosbots.com.br'
            {...register("url", { required: "Insira um URL de site válido" })}
          />
        </Field>
        
        <Button type="submit" bg="#212332" color="#ff9703"  _hover={{ bg: "#ff9703", color:"#212332"}}>Gerar Prompt</Button>
      </Stack>
    </form>
    </Box>
    </Center>
  )
}

export default FrontPage
