import React from "react";
import OnBoardingBase from "./base";
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
import { useNavigate } from "react-router-dom";
import { useProjectState, useProjectDispatch } from "~/hooks/login/use-project";
import { ProjectActionKind } from "~/providers";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  return json({});
};

export default function OnboardingAdminPassword() {
  // define hooks
  const navigate = useNavigate();
  const dispatch = useProjectDispatch();
  const [ready, setReady] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { password: passwordState } = useProjectState();

  // passState could be undefinded, so check it
  const passState = passwordState ? passwordState : "";

  // if 'passwordState' not defined, get respetive previous value
  const [password, setPassword] = React.useState(passState);

  // define handlers
  const handleClickInputButton = () => setShow(!show);
  const handleChangeCheck = () => setChecked(!checked);
  const handleChangePassword = ({ target: { value } }: any) =>
    setPassword(value);
  const handleSubmitForm = () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    // save password on project provider context
    dispatch({ type: ProjectActionKind.SET_PASSWORD, payload: { password } });

    // fake waiting
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/project");
    }, 500);
  };

  // define effects
  React.useEffect(
    () => setReady(password.length && checked ? true : false),
    [password, checked]
  );

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
        <FormControl>
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
              disabled={!ready}
              isLoading={isSubmitting}
              width={"full"}
              bgColor={"pink.400"}
              fontWeight={"normal"}
              color={"white"}
              type="submit"
              size={"lg"}
              onClick={handleSubmitForm}
            >
              Continue
            </Button>
          </VStack>
        </FormControl>
      </OnBoardingBase>
    </VStack>
  );
}
