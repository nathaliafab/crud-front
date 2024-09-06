import { useState, useCallback, useRef, useEffect } from 'react';
import useGames from './useGames';
import useLocalGames from './useLocalGames';
import { NotFoundError } from '../types/Errors';
import { Game } from '../types/Game';

/**
 * Custom Hook para implementar rolagem infinita.
 * 
 * @param initialPage - Página inicial para a paginação.
 * @param pageSize - Número de itens por página (estou usando 10).
 * @param searchQuery - Termo de pesquisa para filtrar os jogos.
 * @param local - Define se a busca é local ou remota.
 * @param updatedTrigger - Gatilho para atualizar a lista de jogos.
 * @returns Um objeto contendo os jogos carregados, o estado de carregamento, possíveis erros e uma referência para o elemento de carregamento.
 */
const useInfiniteScroll = (initialPage: number, pageSize: number, searchQuery: string = '', local: boolean = false, updatedTrigger: number = 0) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const prevSearchRef = useRef<string>(searchQuery);
    const [currGames, setCurrGames] = useState<Game[]>([]);
    const [isLocal, setIsLocal] = useState(local);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const loadingIndicatorRef = useRef<HTMLDivElement | null>(null);

    const { games: remoteGames, loading: remoteLoading, error: remoteError } = useGames(currentPage, pageSize, searchQuery, prevSearchRef.current, currGames, updatedTrigger);
    const { games: localGames, loading: localLoading, error: localError } = useLocalGames(currentPage, pageSize, searchQuery, prevSearchRef.current, currGames, updatedTrigger);

    // Atualizar o estado de jogos e carregamento com base na fonte
    useEffect(() => {
        setLoading(isLocal ? localLoading : remoteLoading);
        setError((isLocal ? localError : remoteError) as Error | null);
        setCurrGames(isLocal ? localGames : remoteGames);
    }, [isLocal, localLoading, remoteLoading, localError, remoteError, localGames, remoteGames]);

    const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
        const entry = entries[0];
        if (error instanceof NotFoundError) {
            return;
        }
        if (entry.isIntersecting && !loading) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    }, [loading, error]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, { threshold: 1.0 });
        if (loadingIndicatorRef.current) {
            observer.observe(loadingIndicatorRef.current);
        }

        return () => {
            if (loadingIndicatorRef.current) {
                observer.unobserve(loadingIndicatorRef.current);
            }
        };
    }, [handleIntersection]);

    useEffect(() => {
        setCurrentPage(1);
        setCurrGames([]);
        setIsLocal(local);
        prevSearchRef.current = searchQuery;
    }, [local, searchQuery, updatedTrigger]);

    return { games: currGames, loading, error, loadMoreRef: loadingIndicatorRef };
};

export default useInfiniteScroll;
