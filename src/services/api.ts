import axios from 'axios';
import { Game, GameSchema } from '../types/Game';
import { ValidationError, GameAlreadyAddedError } from '../types/Errors';

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

const rawg_api = axios.create({
    baseURL: 'https://api.rawg.io/api/games',
    params: {
        key: API_KEY,
    },
});

const json_api = axios.create({
    baseURL: 'http://localhost:8000/games',
});

// Função para validar os dados do jogo com o esquema Zod
const validateGameData = (data: any): Game | null => {
    try {
        return GameSchema.parse(data);
    } catch (error) {
        console.error('Invalid game data:', error);
        return null;
    }
};

// Função para pegar jogos da API externa com paginação e pesquisa
export const getGames = async ({ search = '', page = 1 }: { search?: string; page?: number }): Promise<Game[]> => {
    try {
        const response = await rawg_api.get('', {
            params: {
                page,
                page_size: 10,
                search,
            },
        });

        const results = response.data.results;
        const games: Game[] = results.map((result: any) => ({
            id: result.id,
            slug: result.slug,
            name: result.name,
            released: result.released,
            background_image: result.background_image,
            rating: result.rating,
            rating_top: result.rating_top,
            platforms: result.platforms.map((platform: any) => ({
                id: platform.platform.id,
                slug: platform.platform.slug,
                name: platform.platform.name
            }))
        }));

        console.log('Games fetched:', games);
        return games;
    } catch (error) {
        console.error('Error fetching games:', error);
        return [];
    }
};

// Função para adicionar um jogo na API local
export const addGame = async (game: Game): Promise<void> => {
    try {
        const validGame = validateGameData(game);
        if (!validGame) {
            throw new ValidationError('Invalid game data');
        }

        const gameAlreadyAdded = await checkGameExists(validGame.id);
        if (gameAlreadyAdded) {
            throw new GameAlreadyAddedError('Game already exists');
        }

        await json_api.post('', validGame);
        console.log('Game added successfully:', validGame);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error adding game:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
};

// Função para remover um jogo da API local
export const removeGame = async (id: number): Promise<void> => {
    try {
        const response = await json_api.delete(`/${id}`);
        console.log('Game removed successfully:', response);
    } catch (error) {
        console.error('Error removing game:', error);
    }
};

// Função para atualizar um jogo na API local
export const updateGame = async (id: number, updatedGame: Partial<Game>): Promise<void> => {
    try {
        const validGame = validateGameData({ ...updatedGame, id } as Game);
        if (!validGame) {
            throw new ValidationError('Invalid game data');
        }
        const response = await json_api.put(`/${id}`, validGame);
        console.log('Game updated successfully:', response);
    } catch (error) {
        console.error('Error updating game:', error);
    }
};

// Função para verificar se um jogo já foi adicionado na API local
export const checkGameExists = async (id: number): Promise<boolean> => {
    try {
        const response = await json_api.get(`/${id}`);
        return response.status === 200;
    } catch (error) {
        return false;
    }
};

// Função para recuperar todos os jogos da API local com paginação e pesquisa
export const getLocalGames = async ({ search = '', page = 1, }: { search?: string; page?: number; }): Promise<Game[]> => {
    const pageSize = 10;

    try {
        const response = await json_api.get('', {
            params: {
                _page: page,
                _per_page: pageSize,
                _start: (page - 1) * pageSize,
                _limit: pageSize,
            },
        });

        const games: Game[] = (response.data as Game[]).filter((game: Game) => game.name.toLowerCase().includes(search.toLowerCase()));
        return games;
    }
    catch (error) {
        console.error('Error fetching local games:', error);
        return [];
    }
};
