import { useState, useEffect } from 'react';
import { getLocalGames } from '../services/api';
import { Game } from '../types/Game';
import { NotFoundError } from '../types/Errors';

/**
 * Custom Hook para carregar jogos da API externa com paginação e pesquisa.
 * 
 * @param initialPage - Página inicial para a paginação.
 * @param pageSize - Número de itens por página (estou usando 10).
 * @param search - Termo de pesquisa para filtrar os jogos.
 * @param prevSearch - Termo de pesquisa anterior para limpar a lista de jogos ao mudar a pesquisa.
 * @param currGames - Lista atual de jogos, usada para adicionar novos jogos sem duplicatas.
 * @param updatedTrigger - Gatilho para atualizar a lista de jogos.
 * @returns Um objeto contendo os jogos carregados, o estado de carregamento e possíveis erros.
 */
const useLocalGames = (initialPage: number, pageSize: number, search?: string, prevSearch?: string, currGames: Game[] = [], updatedTrigger: number = 0) => {
    const [games, setGames] = useState<Game[]>(currGames);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | Error | null>(null);

    const fetchGames = async (page: number) => {
        setLoading(true);
        if (!(error instanceof NotFoundError))
            setError(null); // Limpa o erro antes de começar uma nova busca

        try {
            const fetchedGames = await getLocalGames({ search, page });

            setGames(prevGames => {
                // Se a pesquisa mudou, substitui a lista de jogos
                if (search !== prevSearch || currGames.length === 0 || fetchGames.length <= currGames.length) {
                    return fetchedGames;
                } else {
                    const existingGameIds = new Set(prevGames.map(game => game.id));
                    const uniqueFetchedGames = fetchedGames.filter(game => !existingGameIds.has(game.id));
                    return [...prevGames, ...uniqueFetchedGames];
                }
            });

            if (fetchedGames.length === 0) {
                setError('No more games to load');
                setLoading(false);

                throw new NotFoundError('No more games to load');
            }

            setLoading(false);
        } catch (err) {
            if (err instanceof NotFoundError) {
                setError(err);
            } else {
                console.error('Error fetching games:', err);
                setError('Failed to fetch games');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames(initialPage);
    }, []);

    useEffect(() => {
        fetchGames(initialPage);
    }, [initialPage, search, pageSize, updatedTrigger]);

    return { games, loading, error };
};

export default useLocalGames;
