export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class GameAlreadyAddedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'GameAlreadyAddedError';
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
    }
}