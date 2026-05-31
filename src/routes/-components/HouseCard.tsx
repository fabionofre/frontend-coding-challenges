import { HouseType } from "@lib/constants/houses";

type HouseCardProps = {
  house: HouseType;
  onClick: (house: HouseType) => void;
};

// Figma "houses" card: 250×350, 20px radius, drop shadow 0 10px 10px rgba(0,0,0,.25).
export const HouseCard = ({ house, onClick }: HouseCardProps) => {
  const handleClick = () => onClick(house);

  return (
    <button
      onClick={handleClick}
      aria-label={house}
      className="relative isolate flex h-[350px] w-[250px] flex-col justify-end overflow-hidden rounded-[20px] no-underline shadow-[0_10px_10px_0_rgba(0,0,0,0.25)] transition-transform duration-300 hover:scale-105 hover:no-underline"
    >
      <img
        src={`/houses/${house}.png`}
        alt={house}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </button>
  );
};
