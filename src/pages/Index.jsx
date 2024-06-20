import React, { useState, useEffect } from 'react';
import { Container, Text, VStack, Input, Box, Link, Switch, useColorMode } from "@chakra-ui/react";
import axios from 'axios';

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const topStories = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
        const storyIds = topStories.data.slice(0, 5);
        const storyPromises = storyIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
        const stories = await Promise.all(storyPromises);
        setStories(stories.map(story => story.data));
        setFilteredStories(stories.map(story => story.data));
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    setFilteredStories(
      stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, stories]);

  return (
    <Container centerContent maxW="container.md" py={4}>
      <Box display="flex" justifyContent="space-between" width="100%" mb={4}>
        <Text fontSize="2xl">Hacker News Top Stories</Text>
        <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} />
      </Box>
      <Input
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
      />
      <VStack spacing={4} width="100%">
        {filteredStories.map(story => (
          <Box key={story.id} p={4} borderWidth="1px" borderRadius="md" width="100%">
            <Text fontSize="xl" fontWeight="bold">{story.title}</Text>
            <Link href={story.url} color="teal.500" isExternal>Read more</Link>
            <Text>Upvotes: {story.score}</Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;