import { useState, useCallback, useRef, useEffect } from 'react';
import useGames from './useGames';

/**
 * Custom Hook para implementar rolagem infinita.
 * 
 * @param initialPage - Página inicial para a paginação.
 * @param pageSize - Número de itens por página (estou usando 10).
 * @param searchQuery - Termo de pesquisa para filtrar os jogos.
 * @returns Um objeto contendo os jogos carregados, o estado de carregamento, possíveis erros e uma referência para o elemento de carregamento.
 */
const useInfiniteScroll = (initialPage: number, pageSize: number, searchQuery: string = '') => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const prevSearchRef = useRef<string | undefined>(searchQuery); // Ref para armazenar o valor da pesquisa anterior
    const { games, loading, error } = useGames(currentPage, pageSize, searchQuery, prevSearchRef.current);
    const loadingIndicatorRef = useRef<HTMLDivElement | null>(null); // Referência para o elemento que será usado como marcador para rolagem infinita


    const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading) { // Se o elemento está visível e não está carregando, incrementa a página
            setCurrentPage(prevPage => prevPage + 1);
        }
    }, [loading]);

    useEffect(() => {
        // Se a pesquisa mudou, volta para a primeira página
        if (searchQuery !== prevSearchRef.current) {
            setCurrentPage(1);
            prevSearchRef.current = searchQuery;
        }

        // Configura o IntersectionObserver para observar o elemento de carregamento
        const observer = new IntersectionObserver(handleIntersection, { threshold: 1.0 });
        if (loadingIndicatorRef.current) {
            observer.observe(loadingIndicatorRef.current);
        }

        // Limpeza do observer quando o componente é desmontado ou a função de callback muda
        return () => {
            if (loadingIndicatorRef.current) {
                observer.unobserve(loadingIndicatorRef.current);
            }
        };
    }, [handleIntersection]);

    return { games, loading, error, loadMoreRef: loadingIndicatorRef };
};

export default useInfiniteScroll;
