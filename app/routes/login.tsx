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
import { Form } from "@remix-run/react";
import { MockUser, createUserSession, getUserId } from "~/session.server";
import { LoginRespose } from "~/pkg/infra/requests";

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/admin");

  return json({});
};

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const body = await request.formData();
  const password = body.get("password") as string;

  const userEmail = "admin@darchlabs.com";

  // Mock data
  // const mockMeta = {
  //   token: "string",
  //   verification_token: "string",
  // };
  // const res = { data: MockUser, meta: mockMeta } as LoginRespose;
  const res = await infra.Login(userEmail, password);

  // TODO(nb): return error if not exists
  // if (!req.data.id && req.data.id === "") {
  //   return json({ error });
  // }
  // const token = req.meta.token;

  return createUserSession({
    request,
    userId: res.data.id,
  });

  // return redirect(`/admin?token=${token}`);
};

export default function OnboardingAdminPassword() {
  // define hooks
  const [show, setShow] = React.useState(false);
  const [checked, setChecked] = React.useState(false);

  // if 'passwordState' not defined, get respetive previous value
  const [password, setPassword] = React.useState("");

  // define handlers
  const handleClickInputButton = () => setShow(!show);
  const handleChangeCheck = () => setChecked(!checked);
  const handleChangePassword = ({ target: { value } }: any) => {
    setPassword(value);
  };

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

            <Checkbox
              pt={4}
              pb={5}
              colorScheme="pink"
              checked={!checked}
              onChange={handleChangeCheck}
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
              disabled={false}
              isLoading={false}
              width={"full"}
              bgColor={"pink.400"}
              fontWeight={"normal"}
              color={"white"}
              name="_action"
              type="submit"
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
