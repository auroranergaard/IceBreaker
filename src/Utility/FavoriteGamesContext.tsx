import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from "../AuthContext/index";
import { getFavoritesByUser } from "./DatabaseReadUtil";

const FavoriteGamesContext = createContext([]);


export const useFavoriteGames = () => useContext(FavoriteGamesContext);

export const FavoriteGamesProvider = ({ children }: { children: React.ReactNode }) => {


    const FavoriteGamesContext = createContext<string[]>([]);

    const { currentUser } = useAuth();
    const [favoriteGameIDs, setFavoriteGameIds] = useState<string[]>([]);

    useEffect(() => {
        if (currentUser) {
            getFavoritesByUser(currentUser.uid).then(setFavoriteGameIds);
        }
    }, [currentUser]);

    return (
        <FavoriteGamesContext.Provider value={favoriteGameIDs || []}>
            {children}
        </FavoriteGamesContext.Provider>
    );
};
