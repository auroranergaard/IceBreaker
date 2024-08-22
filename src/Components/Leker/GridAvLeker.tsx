import { Grid } from "@mantine/core";
import { useState, useEffect } from "react";
import Lek from "./Lek";

type Game = {
  author: string;
  category: string;
  description: string;
  gameID: string;
  image: string;
  name: string;
  ratings: number[];
  tags: string[];
};

type GridAvLekerProps = {
  searchTerm: string;
  selectedFilters?: string[];
  gamesToShow: Game[];
  antallLekerPerRad: number;
};


function GridAvLeker({
  searchTerm,
  selectedFilters,
  gamesToShow,
  antallLekerPerRad,
}: GridAvLekerProps) {
  const [gameData, setLekerData] = useState<Game[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setLekerData(gamesToShow);
  }, [gamesToShow]);

  const filteredLeker = gameData.filter(
    (game) =>
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedFilters?.length === 0
        ? true
        : selectedFilters?.includes(game.category))
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <Grid w={"66%"}>
      {filteredLeker.map((game) => (
        <Grid.Col span={isMobile ? 12 : (12 / antallLekerPerRad)} key={game.gameID}>
          <Lek
            name={game.name}
            category={game.category}
            description={game.description}
            gameID={game.gameID}
            image={game.image}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
}

export default GridAvLeker;
