import { LogoSquareIcon, ChainlinkAvatarIcon } from "@components/icon";

export const GetProviderAvatar = (provider: string, size: number = 12) => {
  switch (provider) {
    case "Darch Labs Keepers":
      return { ...(<LogoSquareIcon boxSize={size} />) };
    case "Chainlink Keepers":
      return { ...(<ChainlinkAvatarIcon boxSize={size} />) };
  }
};
