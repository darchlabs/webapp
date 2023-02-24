import React from "react";
import OnBoardingBase from "../components/onboarding/base";
import {
  Text,
  FormControl,
  VStack,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  Checkbox,
  IconButton,
} from "@chakra-ui/react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import type {
  ActionArgs,
  ActionFunction,
  LoaderArgs,
  LoaderFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { infra } from "~/pkg/infra/infra.server";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { MockUser, createUserSession, getUserId } from "~/session.server";
import type { LoginRespose } from "~/pkg/infra/requests";

type actionData =
  | {
      error: string;
      errorPassword: string;
    }
  | undefined;

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/admin");

  return json({});
};

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const body = await request.formData();
  const password = body.get("password") as string;

  const userEmail = "admin@darchlabs.com";

  // // Mock data
  // const mockMeta = {
  //   token: "string",
  //   verification_token: "string",
  // };
  // const res = { data: MockUser, meta: mockMeta } as LoginRespose;
  // if (typeof res.data === "string") {
  //   const error = "User cannot be found with the given password";
  //   return json({ error, errorPassword: password });
  // }

  let res = { data: "" } as LoginRespose;
  let error = "";
  try {
    res = await infra.Login(userEmail, password);
  } catch (err) {
    error = err as string;
  }

  // return error if not exists
  if (error !== "" || typeof res.data === "string") {
    const error = "User cannot be found with the given password";
    return json({ error, errorPassword: password });
  }

  return createUserSession({
    request,
    userId: res.data.id,
  });
};

export default function OnboardingAdminPassword() {
  // define hooks
  const [show, setShow] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [checkAccepted, setCheckAccepted] = React.useState(false);

  // define handlers
  const handleClickInputButton = () => setShow(!show);
  const handleChangePassword = ({ target: { value } }: any) => {
    setPassword(value);
  };
  const handleChangeCheckAccepted = () => setCheckAccepted(!checkAccepted);

  // Define state for loader in the button
  const transition = useTransition();
  const isSubmitting =
    transition.submission?.formData.get("_action") === "continue";

  // define disabled state for next button and get action data info
  let nextDisabled = false;
  let error = "";

  const actionData = useActionData() as actionData;
  if (actionData?.error) {
    error = actionData.error;

    if (password == actionData?.errorPassword) {
      nextDisabled = true;
    }
  }

  // component
  return (
    <VStack padding={"48"}>
      <OnBoardingBase
        title={"Welcome to Darch"}
        description={
          <Text>
            The first is to set a strong password for the default{" "}
            <Text as={"span"} color={"pink.400"} fontWeight={"bold"}>
              admin
            </Text>{" "}
            user.
          </Text>
        }
      >
        <Form method="post">
          <VStack pt={5} alignItems={"start"} width={"full"}>
            <Text
              mb={1}
              textTransform={"uppercase"}
              color={"gray.400"}
              fontSize={"xs"}
              fontWeight={"bold"}
            >
              Password
            </Text>

            <InputGroup size="lg" borderColor={"gray.100"}>
              <Input
                name="password"
                pr={20}
                type={show ? "text" : "password"}
                placeholder="Password"
                bgColor={"gray.50"}
                color="gray.500"
                fontWeight={"normal"}
                fontSize={"md"}
                onChange={(ev) => handleChangePassword(ev)}
                defaultValue={password}
                _placeholder={{
                  color: "gray.500",
                  opacity: 0.4,
                  fontWeight: "light",
                  fontSize: "md",
                }}
                _focusVisible={{
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: "pink.400",
                }}
              />

              <InputRightElement>
                <IconButton
                  aria-label="Show or hide password input button"
                  variant={"unstyled"}
                  onClick={handleClickInputButton}
                  color="gray.500"
                  icon={show ? <BsEyeSlash /> : <BsEye />}
                  size="lg"
                />
              </InputRightElement>
            </InputGroup>
            {error === "" ? null : (
              <Text color={"red.400"}>Error: {error}</Text>
            )}
            <Checkbox
              pt={4}
              pb={5}
              colorScheme="pink"
              checked={!checkAccepted}
              onChange={handleChangeCheckAccepted}
            >
              <Text color={"gray.400"} fontWeight={"normal"} fontSize={"xs"}>
                I agree to the{" "}
                <Text as={"span"} color={"pink.400"}>
                  Term and Conditions
                </Text>{" "}
                for using Darch
              </Text>
            </Checkbox>

            <Button
              disabled={password === "" || !checkAccepted || nextDisabled}
              isLoading={isSubmitting}
              width={"full"}
              bgColor={"pink.400"}
              fontWeight={"normal"}
              color={"white"}
              name="_action"
              type="submit"
              value="continue"
              size={"lg"}
            >
              Continue
            </Button>
          </VStack>
        </Form>
      </OnBoardingBase>
    </VStack>
  );
}
