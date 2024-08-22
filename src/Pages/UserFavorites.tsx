//IceBreaker/src/Pages/UserFavorites.tsx
import { Box, Container, Group, Stack } from "@mantine/core";
import { useState, useEffect } from "react";
import Header from "../Components/Header";
import GridAvLeker from "../Components/Leker/GridAvLeker";
import ListeAvFilters from "../Components/Søk_Og_Filter/ListeAvFilter";
import { useAuth } from "../AuthContext/index";
import { getFavoritesByUser, getGameByID } from "../Utility/DatabaseReadUtil";
import SpinTheWheel from "../Components/spin_the_wheel/spin_the_wheel";

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

function UserFavorites() {
    const { currentUser } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [gamesToShow, setGamesToShow] = useState<Game[]>([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (currentUser) {
                try {
                    //Fetch the array of favorite game IDs
                    const favoriteIDs = await getFavoritesByUser(currentUser.uid);

                    //Fetch game details for each ID
                    const fetchGamesPromises = favoriteIDs.map((id) => getGameByID(id));
                    const favoriteGames = await Promise.all(fetchGamesPromises);

                    //Filter out undefined values
                    const validFavoriteGames = favoriteGames.filter(Boolean) as Game[];

                    //Update Component state
                    setGamesToShow(validFavoriteGames);
                } catch (error) {
                    console.error("Failed to fetch favorite games:", error);
                    setGamesToShow([]);
                }
            }
        };
        fetchFavorites();
    }, []);

    return (
        <Stack>
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm}></Header>
            <Stack align="center" justify="flex-start">
                <h1>Mine favoritter</h1>
                <ListeAvFilters
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                ></ListeAvFilters>
            </Stack>
            <Group justify="center">
                <GridAvLeker
                    searchTerm={searchTerm}
                    selectedFilters={selectedFilters}
                    gamesToShow={gamesToShow}
                    antallLekerPerRad={3}
                ></GridAvLeker>
            </Group>
            <SpinTheWheel gamesForWheel={gamesToShow}></SpinTheWheel>
        </Stack>
    );
}

export default UserFavorites;
