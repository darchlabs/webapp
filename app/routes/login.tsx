import { Text, VStack, Input, Show, Button, Image, Box, Alert, AlertIcon, InputGroup, InputRightElement } from "@chakra-ui/react";
import { Link, useFetcher, useLocation } from "@remix-run/react";
import { BaseError } from "@errors/base";
import { LogoIcon } from "../components/icon/logo";
import { LoginLoader } from "./login.loader"
import { LoginAction, type LoginActionData } from "./login.action"
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { BaseAuthLayout } from "@components/layouts/auth";

export const loader: LoaderFunction = LoginLoader;
export const action: ActionFunction = LoginAction;
export const ErrorBoundary = BaseError;

export default function App() {
  // define hooks
  const fetcher = useFetcher();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const actionData = fetcher.data as LoginActionData;
  const { search } = useLocation();

  // get redirecTo param if exists
  const queryParams = new URLSearchParams(search);
  const redirectTo = queryParams.get("redirectTo");
  const urlParam = redirectTo ? `?redirectTo=${redirectTo}` : "";
  
   // define effects
   useEffect(() => {
    const newIsFetching = fetcher.state === "submitting";
    if (isFetching != newIsFetching) {
      setIsFetching(newIsFetching);
    }
  }, [fetcher, isFetching]);

  // define handlers
  const onClickHandler = () => {
    // send form to delete event action
    fetcher.submit({email, password}, {
      method: "post",
      action: `/login${urlParam}`,
    });
  }
  const onClickShowPasswordHandler = () => {
    setShowPassword(!showPassword)
  }

  return (
    <BaseAuthLayout>
      <>
        {/* header */}
        <VStack>
          <Show below="md">
            <Box mb={3}>
              <Image as={LogoIcon} boxSize={"55px"}  />
            </Box>
          </Show>
          <Text fontSize={"2xl"} fontWeight={"Bold"} color={"blackAlpha.800"}>Log in to your account</Text>
          <Text color={"blackAlpha.800"}>Don't have an account? <Text as={"span"} color={"pink.500"}><Link to={`/signup${urlParam}`}>Sign up</Link></Text></Text>
        </VStack>

        {/* alert */}
        {actionData?.email?.length! > 0 || actionData?.password?.length! > 0 || actionData?.error?.length! > 0 ? (
          <Alert borderRadius={5} status='error'>
            <AlertIcon />
            {actionData?.email || actionData?.password || actionData?.error}
          </Alert>
        ) : null}

        {/* form */}
        <VStack alignItems={"start"} width={"full"} spacing={5}>
          {/* email */}
          <VStack alignItems={"start"} width={"full"}>
            <Text color={"blackAlpha.800"} >Email</Text>
            <Input isInvalid={!!actionData?.email} errorBorderColor='red.300' placeholder='Enter your email' onChange={(ev) => setEmail(ev.target.value)} />
          </VStack>

          {/* passowrd */}
          <VStack alignItems={"start"} width={"full"}>
            <Text color={"blackAlpha.800"}>Password</Text>
            <InputGroup width={"full"} size='md'>
              <Input
                pr='4.5rem'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                isInvalid={!!actionData?.password} 
                errorBorderColor='red.300'
                onChange={(ev) => setPassword(ev.target.value)}
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={onClickShowPasswordHandler}>
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </VStack>

          {/* button */}
          <Box width={"full"} pt={3}>
            <Button onClick={onClickHandler} disabled={email === "" || password === ""} w={"full"} size={"lg"} colorScheme="pink">Sign In</Button>
          </Box>
        </VStack>
      </>
    </BaseAuthLayout>
  );
}

