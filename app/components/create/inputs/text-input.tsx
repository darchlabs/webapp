import { useState } from "react";
import { Input, Text } from "@chakra-ui/react";

export function TextInput({
  title,
  name,
  form,
  value = "",
  placeholder,
  error,
}: {
  title: string;
  name: string;
  form: string;
  value: string;
  placeholder: string;
  error?: string;
}): JSX.Element {
  // define hooks
  const [text, setText] = useState(value as string);

  // define values
  const color = error ? "red.500" : "blackAlpha.500";

  return (
    <>
      <Text color={color} fontWeight={"semibold"} fontSize={"md"}>
        {title}
      </Text>

      <Input
        size="lg"
        isInvalid={!!error}
        errorBorderColor="red.500"
        focusBorderColor={"pink.400"}
        name={name}
        value={text}
        form={form}
        placeholder={placeholder}
        onChange={(ev) => setText(ev.target.value)}
      />

      {error ? <Text color={color}>{error}</Text> : null}
    </>
  );
}
