import React, { useEffect, useState } from 'react';

interface NewsFeed {
    title: string;
    description: string;
    url: string;
    source: string;
    image?: string;
    category: string;
    language: string;
    country: string;
    publishedAt: string; // Use string to handle DateTime from C#
}

const NewsFeedComponent = () => {
  const [newsFeed, setNewsFeed] = useState<NewsFeed[]>([]);

    useEffect(() => {
        const fetchNewsFeed = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await fetch('https://localhost:7155/newsfeeds', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data: NewsFeed[] = await response.json();

                // Remove duplicates based on the URL
                const uniqueNewsFeed = Array.from(new Set(data.map(news => news.url)))
                    .map(url => data.find(news => news.url === url)!);

                setNewsFeed(uniqueNewsFeed);
            } catch (error) {
                console.error('Error fetching news feed:', error);
            }
        };

        fetchNewsFeed();
    }, []);

  return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white">
          <thead>
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Source</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Published At</th>
            <th className="px-4 py-2">Image</th>
          </tr>
          </thead>
          <tbody>
          {newsFeed.map((news, index) => (
              <tr key={index} className="border-t border-gray-700">
                <td className="px-4 py-2">{news.title}</td>
                <td className="px-4 py-2">{news.description}</td>
                <td className="px-4 py-2">{news.source}</td>
                <td className="px-4 py-2">{news.category}</td>
                <td className="px-4 py-2">{new Date(news.publishedAt).toLocaleString()}</td>
                <td className="px-4 py-2">
                  {news.image && <img src={news.image} alt={news.title} className="w-32 h-32 object-cover" />}
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default NewsFeedComponent;