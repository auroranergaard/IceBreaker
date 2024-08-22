import { Group, Stack, ScrollArea } from "@mantine/core";
import { useState, useEffect } from "react";
import Header from "../Components/Header";
import GridAvLeker from "../Components/Leker/GridAvLeker";
import ListeAvFilters from "../Components/Søk_Og_Filter/ListeAvFilter";
import NyLek from "../Components/Leker/NyLek";
import { useAuth } from "../AuthContext";
import { getAllGames } from "../Utility/DatabaseReadUtil";

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

function Home() {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [games, setGamesToShow] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
        try {
          //Fetch all games
          const allGames = await getAllGames();
          
          //Filter out undefined values
          const validGames = allGames.filter(Boolean) as Game[];
  
          //Update Component state
          setGamesToShow(validGames);
        } catch (error) {
          console.error("Failed to fetch favorite games:", error);
          setGamesToShow([]);
        }
    };
  
    fetchGames();
  }, []);

  return (
    <Stack>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm}></Header>
      <Stack align="center" justify="flex-start">
        <NyLek></NyLek>
        <ListeAvFilters
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        ></ListeAvFilters>
      </Stack>
      <ScrollArea h={600}>
        <Group justify="center">
          <GridAvLeker
            searchTerm={searchTerm}
            selectedFilters={selectedFilters}
            gamesToShow={games}
            antallLekerPerRad={3}></GridAvLeker>
        </Group>
      </ScrollArea>
    </Stack>
  );
}

export default Home;
