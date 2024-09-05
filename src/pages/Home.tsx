import { useState, useEffect } from 'react';
import GameList from '../components/GameList';
import Header from '../components/Header';

const Home = () => {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        console.log('Home page mounted');
    }, []);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const handleSearch = (query: string) => {
        console.log('Search query:', query);
        setSearchQuery(query);
    };

    useEffect(() => {
        console.log('atuando na busca:', searchQuery);
    }, [searchQuery]);

    return (
        <div>
            <Header activeTab={activeTab} onTabChange={handleTabChange} onSearch={handleSearch} />
            <div>
                {activeTab === 'all' ? (
                    <GameList searchQuery={searchQuery} />
                ) : (
                    <div>
                        <p style={{ textAlign: 'center' }}>No games found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
