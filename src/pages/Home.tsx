import { useState, useEffect } from 'react';
import GameList from '../components/GameList';
import Header from '../components/Header';

const Home = () => {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
    }, []);

    const handleTabChange = (tab: string) => {
        setSearchQuery('');
        setActiveTab(tab);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    useEffect(() => {
    }, [searchQuery, activeTab]);

    return (
        <div>
            <Header activeTab={activeTab} onTabChange={handleTabChange} onSearch={handleSearch} />
            <div>
                {activeTab === 'all' ? (
                    <GameList searchQuery={searchQuery} local={false} />
                ) : (
                    <GameList searchQuery={searchQuery} local={true} />
                )}
            </div>
        </div>
    );
};

export default Home;
