import { Icon } from "@chakra-ui/react";

export default function ErrorIcon(props: any) {
  return (
    <Icon {...props} viewBox="0 0 55 69">
      <g filter="url(#filter0_d_1447_11188)">
        <path
          d="M4 7C4 4.23858 6.23858 2 9 2H37L44 9L51 16V56C51 58.7614 48.7614 61 46 61H9C6.23858 61 4 58.7614 4 56V7Z"
          fill="#F6D9E2"
        />
      </g>
      <g filter="url(#filter1_d_1447_11188)">
        <path d="M37 2L44.5 9.5L51 16H37V2Z" fill="#E8A6B8" />
      </g>
      <path
        d="M38.5 33C39.5 31.8333 41.7 29.5 42.5 29.5M38.5 29.5C39.6667 30.1667 42.1 31.9 42.5 33.5"
        stroke="black"
        stroke-width="0.75"
      />
      <path d="M12 29.5C13 30 15.2 31.5 16 33.5" stroke="black" stroke-width="0.75" />
      <path d="M12.5 33C13.3333 31.8333 15.2 29.5 16 29.5" stroke="black" stroke-width="0.75" />
      <path d="M21 37.9999C23.3333 35.9999 29.3 33.1999 34.5 37.9999" stroke="black" />
      <defs>
        <filter
          id="filter0_d_1447_11188"
          x="0"
          y="2"
          width="55"
          height="67"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1447_11188" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1447_11188" result="shape" />
        </filter>
        <filter
          id="filter1_d_1447_11188"
          x="29"
          y="0"
          width="24"
          height="24"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-3" dy="3" />
          <feGaussianBlur stdDeviation="2.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.683333 0 0 0 0 0.492569 0 0 0 0 0.544596 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1447_11188" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1447_11188" result="shape" />
        </filter>
      </defs>
    </Icon>
  );
}
