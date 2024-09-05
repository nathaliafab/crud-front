import React, { useEffect, useState } from 'react';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { Button, Image } from '@nextui-org/react';
import { Game } from '../types/Game';
import GameForm from './GameForm';

interface GameListParams {
    searchQuery: string;
}

const GameList: React.FC<GameListParams> = ({ searchQuery }) => {
    const { games, loading, error, loadMoreRef } = useInfiniteScroll(1, 10, searchQuery);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleAddGameClick = (game: Game) => {
        setSelectedGame(game);
        setIsFormVisible(true);
    };

    useEffect(() => {
        console.log('GameList mounted');
    }, [searchQuery]);

    return (
        <div className="flex-col relative p-2 bg-gray-100 min-h-screen shadow-sm">
            {games.length === 0 && !loading && !error && (
                <p className="text-center text-gray-500">No games found.</p>
            )}
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 pb-4 w-[90%] mx-auto">
                <li className="flex-col items-center w-full">
                    {games.map((game: Game) => (
                        <div
                            key={`${game.id}`}
                            className="flex items-center p-4 bg-white border border-gray-300 shadow-md"
                        >
                            {game.background_image && (
                                <div className="p-2 overflow-hidden">
                                    <Image
                                        isZoomed
                                        src={game.background_image}
                                        alt={game.name}
                                        radius='lg'
                                        height={128}
                                        width={128}
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>

                            )}
                            <div className="flex-1 p-2">
                                <strong className="text-xl mb-2 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{game.name}</strong>
                                <p className="text-sm text-gray-600">Released: {new Date(game.released).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-600">Rating: {game.rating} / {game.rating_top}</p>
                            </div>
                            <div className="px-4 items-center cursor-pointer rounded-full">
                                <Button
                                    onClick={() => handleAddGameClick(game)}
                                    color="secondary"
                                    aria-label="Adicionar jogo"
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '36px',
                                        height: '36px',
                                        minWidth: 'auto',
                                        borderRadius: '50%',
                                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s, box-shadow 0.3s',
                                    }}
                                >
                                    <span className='color-white text-lg font-semibold'>+</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                </li>
            </ul>

            {loading && (
                <div className="flex items-center gap-2 justify-center py-4">
                    <div className="w-5 h-5 rounded-full animate-pulse bg-purple-500"></div>
                    <div className="w-5 h-5 rounded-full animate-pulse bg-purple-500"></div>
                    <div className="w-5 h-5 rounded-full animate-pulse bg-purple-500"></div>
                </div>
            )}

            {
                error && (
                    <p className="text-center text-red-500 mt-2">
                        {error}
                    </p>
                )
            }

            <div ref={loadMoreRef} />

            {
                isFormVisible && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
                            <GameForm onClose={() => setIsFormVisible(false)} game={selectedGame} />
                        </div>
                    </div>
                )
            }
        </div >

    );
};

export default GameList;
