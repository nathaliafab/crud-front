import { useState, useEffect, useRef } from 'react';
import { getGames } from '../services/api';
import { Game } from '../types/Game';

/**
 * Custom Hook para carregar jogos da API externa com paginação e pesquisa.
 * 
 * @param initialPage - Página inicial para a paginação.
 * @param pageSize - Número de itens por página (estou usando 10).
 * @param search - Termo de pesquisa para filtrar os jogos.
 * @param prevSearch - Termo de pesquisa anterior para limpar a lista de jogos ao mudar a pesquisa.
 * @returns Um objeto contendo os jogos carregados, o estado de carregamento e possíveis erros.
 */
const useGames = (initialPage: number, pageSize: number, search?: string, prevSearch?: string) => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGames = async (page: number) => {
            setLoading(true);
            setError(null); // Limpa o erro antes de começar uma nova busca

            try {
                console.log(`Fetching games: page=${page}, search=${search}, pageSize=${pageSize}`);
                const fetchedGames = await getGames({ search, page });

                setGames(prevGames => {
                    // Se a pesquisa mudou, substitui a lista de jogos
                    if (search !== prevSearch) {
                        return fetchedGames;
                    } else {
                        // Se a pesquisa não mudou e estamos em uma página diferente de 1, adiciona os novos jogos
                        const existingGameIds = new Set(prevGames.map(game => game.id));
                        const uniqueFetchedGames = fetchedGames.filter(game => !existingGameIds.has(game.id));
                        return [...prevGames, ...uniqueFetchedGames];
                    }
                });

                setLoading(false);
            } catch (err) {
                console.error('Error fetching games:', err);
                setError('Failed to fetch games');
                setLoading(false);
            }
        };

        fetchGames(initialPage);
    }, [initialPage, search, pageSize]);

    return { games, loading, error };
};

export default useGames;
