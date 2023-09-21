import { Flex, Text, VStack, Show, Image } from "@chakra-ui/react";
import { LogoIconWhite } from "@components/icon/logo-white";

export const BaseAuthLayout = ({ children }: { children: JSX.Element }): JSX.Element => {
	return (
		<Flex h={"100vh"}>
			<Show above="md">
				<VStack 
					px={[10]} 
					py={[8]} 
					h={"100vh"} 
					bgColor={"pink.400"} 
					flex={["0.5", "0.5", "0.5", "0.5", "0.4"]} 
					justifyContent={"space-between"} 
					alignItems={"start"}
				>
					<Image as={LogoIconWhite} boxSize={"55px"} />
					<VStack alignItems={"start"} color="white">
						<Text 
							color={["white"]} 
							fontSize={["2xl", "2xl", "3xl", "3xl", "4xl"]} 
							fontWeight={"extrabold"}
						>
							Unlock the potential of blockchain and Web3
						</Text>
						<Text fontSize={["md", "md", "lg", "lg", "xl", "xl"]}>
							Sign up and explore cutting-edge solutions for the Blockchain and Web3 industry.
						</Text>
					</VStack>
					<Text fontSize={"md"} color={"white"}>
						©2023 DarchLabs. All rights reserved.
					</Text>
				</VStack>
			</Show>
			<Flex flex={["1", "1", "0.5", "0.5", "0.6"]} justifyContent={"center"} px={[10]}>
				<VStack 
					bgColor={["white", "white", "white"]} 
					w={"full"} 
					flex={["0.9", "0.8", "1", "0.8", "0.6"]} 
					justifyContent={"center"} 
					alignItems={"center"} 
					spacing={8}
				>
					{children}
				</VStack>
			</Flex>
		</Flex>
	)
}