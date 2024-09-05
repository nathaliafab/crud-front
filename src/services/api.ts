import axios from 'axios';
import { Game, GameSchema } from '../types/Game'; // Importa o esquema de validação GameSchema

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

const rawg_api = axios.create({
    baseURL: 'https://api.rawg.io/api/games',
    params: {
        key: API_KEY,
    },
});

const json_api = axios.create({
    baseURL: 'http://localhost:3000/games',
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
        console.log('Results:', results);
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
            throw new Error('Invalid game data');
        }
        await json_api.post('', validGame);
        console.log('Game added successfully:', validGame);
    } catch (error) {
        console.error('Error adding game:', error);
    }
};

// Função para remover um jogo da API local
export const removeGame = async (id: number): Promise<void> => {
    try {
        await json_api.delete(`/${id}`);
        console.log('Game removed successfully');
    } catch (error) {
        console.error('Error removing game:', error);
    }
};

// Função para atualizar um jogo na API local
export const updateGame = async (id: number, updatedGame: Partial<Game>): Promise<void> => {
    try {
        const validGame = validateGameData({ ...updatedGame, id } as Game);
        if (!validGame) {
            throw new Error('Invalid game data');
        }
        await json_api.put(`/${id}`, validGame);
        console.log('Game updated successfully');
    } catch (error) {
        console.error('Error updating game:', error);
    }
};

// Função para recuperar um jogo da API local
export const getLocalGame = async (id: number): Promise<Game | null> => {
    try {
        const response = await json_api.get(`/${id}`);
        return validateGameData(response.data);
    } catch (error) {
        console.error('Error fetching local game:', error);
        return null;
    }
};

// Função para recuperar todos os jogos da API local com paginação e pesquisa
export const getLocalGames = async ({ search = '', page = 1, }: { search?: string; page?: number; }): Promise<Game[]> => {
    const pageSize = 10;
    const offset = (page - 1) * pageSize; // Calcula o offset com base na página atual

    try {
        const response = await json_api.get<Game[]>('', {
            params: {
                _limit: pageSize, // Limita o número de jogos retornados
                _start: offset, // Define o ponto de partida para a paginação
            },
        });

        const games = response.data
            .map(game => validateGameData(game))
            .filter((game): game is Game => game !== null)
            .filter(game => game.name.toLowerCase().includes(search.toLowerCase()));

        console.log('Local games fetched:', games);
        return games;
    } catch (error) {
        console.error('Error fetching local games:', error);
        return [];
    }
};
