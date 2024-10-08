import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, Input } from '@nextui-org/react';
import { CloseIcon, CheckIcon } from '@chakra-ui/icons';
import { addGame, updateGame } from '../services/api';
import { Game } from '../types/Game';
import { ValidationError, GameAlreadyAddedError } from '../types/Errors';

interface FormInputs {
    name: string;
    released: string;
    rating: number;
    comment?: string;
}

interface GameFormProps {
    onClose: () => void;
    game?: Game | null;
    isOnlyEdit: boolean;
    onGamesUpdated?: () => void;
}

const GameForm: React.FC<GameFormProps> = ({ onClose, game, isOnlyEdit, onGamesUpdated }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<FormInputs>({
        defaultValues: {
            name: game?.name || '',
            released: game?.released || '',
            rating: game?.rating || 0,
            comment: ''
        },
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setIsSubmitting(true);
        try {
            const gameId = parseInt(game?.id.toString() || Date.now().toString());
            const newGame: Game = {
                id: gameId,
                slug: game?.slug || data.name.toLowerCase().replace(/\s/g, '-'),
                name: data.name,
                released: data.released,
                background_image: game?.background_image || '',
                rating: data.rating,
                rating_top: game?.rating_top || 5,
                comment: data.comment || '',
                platforms: game?.platforms || [],
            };

            if (isOnlyEdit)
                await updateGame(newGame.id, newGame);
            else
                await addGame(newGame);

            if (onGamesUpdated) {
                onGamesUpdated();
            }
            onClose();
        } catch (error) {
            if (error instanceof ValidationError) {
                alert('Dados inválidos. Verifique os campos e tente novamente.');
            }
            if (error instanceof GameAlreadyAddedError) {
                alert('Jogo já adicionado anteriormente.');
            } else {
                console.error('Unexpected error:', error);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative p-6 bg-white rounded-lg max-w-[95%] mx-auto">
            <Button
                onClick={onClose}
                className="absolute top-1 right-3 p-1 rounded-full bg-white hover:text-gray-400 transition-colors text-gray-600"
                isIconOnly
            >
                <CloseIcon />
            </Button>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
                <div className="flex flex-col space-y-2">
                    <Input
                        label="Game Title"
                        id="name"
                        type="text"
                        isDisabled
                        {...register('name')}
                        className="border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <Input
                        label="Release Date"
                        id="released"
                        type="date"
                        isDisabled
                        {...register('released')}
                        className="border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <Input
                        label="Rating"
                        id="rating"
                        type="number"
                        step={0.01}
                        {...register('rating', {
                            required: 'Rating is required',
                            min: { value: 0, message: 'Rating cannot be less than 0' },
                            max: { value: 5, message: 'Rating cannot be more than 5' },
                            valueAsNumber: true
                        })}
                        className="border-gray-300 rounded-md shadow-sm"
                        isRequired
                    />
                    {errors.rating && (
                        <p className="text-red-600 text-sm mt-1">{errors.rating.message}</p>
                    )}
                </div>

                <div className="flex flex-col space-y-2">
                    <Input
                        label="Comment"
                        id="comment"
                        type="text"
                        {...register('comment', {
                            maxLength: { value: 40, message: 'Comment cannot be longer than 40 characters' }
                        })}
                        className="border-gray-300 rounded-md shadow-sm"
                        isClearable
                    />
                    {errors.comment && (
                        <p className="text-red-600 text-sm mt-1">{errors.comment.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    color='secondary'
                    className="w-full py-2 px-4 text-white font-semibold rounded-md shadow-md"
                >
                    <CheckIcon className="mr-2" />
                    {isSubmitting ? 'Enviando...' : 'Salvar'}
                </Button>
            </form>
        </div>
    );
};

export default GameForm;
