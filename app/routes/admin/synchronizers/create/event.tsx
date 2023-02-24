import {
  HStack,
  VStack,
  Text,
  Button,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import {
  type ActionArgs,
  redirect,
  json,
  type LoaderFunction,
} from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";
import react from "react";
import PolygoSelectIcon from "~/components/icon/polygon-select-icon";
import type { SynchronizerFormData } from "~/pkg/synchronizer/types";
import type { abiMethod } from "../../jobs/create/methods";
import { requireUserId } from "~/session.server";

export type abiEvent = {
  anonymous: false;
  inputs: abiMethod[];
  name: string;
  type: string;
};

type loaderData = {
  currentSync: SynchronizerFormData;
};

export const loader: LoaderFunction = async ({ request }: ActionArgs) => {
  // check user is logged
  const userId = await requireUserId(request);

  const currentSync = (await redis.get(
    "createdFormData"
  )) as SynchronizerFormData;
  if (!currentSync) {
    return redirect("/admin/synchronizers/create/network");
  }

  return json<loaderData>({ currentSync });
};

export const action = async ({ request }: ActionArgs) => {
  // check user is logged
  const userId = await requireUserId(request);

  const body = await request.formData();
  // check if pressed back button
  if (body.get("_action") === "back") {
    return redirect("/admin/synchronizers/create/contract");
  }

  // check if pressed cancel button
  if (body.get("_action") === "cancel") {
    await redis.del("createdFormData");
    return redirect("/admin/synchronizers");
  }

  // get current created form data from redis, create if not exists
  let current = (await redis.get("createdFormData")) as SynchronizerFormData;
  if (!current) {
    return redirect("/admin/synchronizers/create/network");
  }

  // Get event
  const event = body.get("event") as any as abiEvent;
  current.raw = `${event}`;

  await redis.set("createdFormData", current);

  // redirect to confirm page
  return redirect(`/admin/synchronizers/create/confirm`);
};

export default function StepEvent() {
  const { currentSync } = useLoaderData() as loaderData;

  let currentEvent = currentSync.event
    ? (currentSync.event as unknown as abiEvent)
    : ({} as abiEvent);

  let [event, setEvent] = react.useState(currentEvent);

  function onClickEvent(event: abiEvent) {
    console.log("setevent: ", event);
    setEvent(event);
  }

  // Define state for loaders in the buttons
  const transition = useTransition();
  const isSubmitting =
    transition.submission?.formData.get("_action") === "next";
  const isGoingBack = transition.submission?.formData.get("_action") === "back";
  const isCanceling =
    transition.submission?.formData.get("_action") === "cancel";

  // Get the view and perform methods
  let abi;
  try {
    abi = JSON.parse(currentSync.abi);
  } catch (error) {
    console.log("err parsing abi: ", error);
  }

  // Get events from the abi
  const events = abi.filter(
    (i: { type: string }) => i.type === "event"
  ) as abiEvent[];

  return (
    <HStack justifyContent={"center"} w={"full"} pt={"5px"}>
      <HStack justifyContent={"left"} w={"full"}>
        <VStack alignItems={"start"}>
          <Form method="post">
            <Text fontSize={"20px"} color={"ActiveBorder"}>
              Event
            </Text>

            <Menu closeOnSelect={true}>
              <MenuButton
                id={"ok"}
                as={Button}
                rightIcon={<PolygoSelectIcon />}
              >
                {event.name ? event.name : "Select the event"}
              </MenuButton>
              <MenuList>
                {events.map((event) => {
                  return (
                    <MenuItem
                      key={event.name}
                      // defaultValue={event.name}
                      onClick={() => {
                        onClickEvent(event);
                      }}
                    >
                      {event.name}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Menu>
            <input name="event" type="hidden" value={JSON.stringify(event)} />

            <HStack
              w={"full"}
              justifyContent={"start"}
              pt={"12px"}
              spacing={"10px"}
            >
              <Button
                size={"sm"}
                colorScheme={"pink"}
                name={"_action"}
                value={"next"}
                type="submit"
                disabled={!event || isCanceling || isGoingBack}
                isLoading={isSubmitting}
              >
                NEXT
              </Button>
              <Button
                size={"sm"}
                colorScheme={"pink"}
                variant={"outline"}
                type="submit"
                name="_action"
                value="back"
                isLoading={isGoingBack}
                isDisabled={isCanceling || isSubmitting}
              >
                BACK
              </Button>
              <Button
                name={"_action"}
                value={"cancel"}
                size={"sm"}
                colorScheme={"pink"}
                variant={"ghost"}
                type="submit"
                isLoading={isCanceling}
                isDisabled={isSubmitting || isSubmitting}
              >
                Cancel
              </Button>
            </HStack>
          </Form>
        </VStack>
      </HStack>
      <HStack justifyContent={"rigth"} w={"full"} paddingBottom={"40px"}>
        <VStack alignItems={"start"}>
          <Text fontSize={"20px"}>
            Third, Select the event to synchronize from the contract.
          </Text>
        </VStack>
      </HStack>
    </HStack>
  );
}
