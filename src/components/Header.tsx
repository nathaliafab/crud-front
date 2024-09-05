import React from 'react';
import { Input } from '@nextui-org/react';
import { SearchIcon } from '@chakra-ui/icons';

interface HeaderProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, onSearch }) => {
    const [searchQuery, setSearchQuery] = React.useState<string>('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        console.log('searchQuery', searchQuery);
        event.preventDefault();
        onSearch(searchQuery);
    };

    return (
        <header className="bg-gray-900 text-white shadow-md">
            <div className="container mx-auto flex items-center justify-between p-4 max-w-screen-xl">
                <div className="text-2xl font-bold">
                    <a href="/">Game Library</a>
                </div>

                <nav className="flex space-x-8">
                    {['all', 'my'].map((tab) => (
                        <button
                            key={tab}
                            className={`text-lg font-medium transition-colors duration-300 
                            ${activeTab === tab ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-300 hover:text-white'}
                            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
                            onClick={() => onTabChange(tab)}
                            aria-current={activeTab === tab ? 'page' : undefined}
                            role="tab"
                        >
                            {tab === 'all' ? 'Todos os Jogos' : 'Meus Jogos'}
                        </button>
                    ))}
                </nav>

                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                    <Input
                        aria-label="Search"
                        placeholder="Digite sua busca..."
                        startContent={<SearchIcon className="text-gray-400" />}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        color="secondary"
                    />
                </form>

            </div>
        </header>
    );
};

export default Header;
