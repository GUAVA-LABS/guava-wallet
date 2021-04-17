import React, { useEffect, useState } from 'react'
import dynamicContent from '@utils/dynamicContent';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

const NewsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const NewsItem = styled.div`
    margin-top: 15px;
    width: 100%;
    font-size: 1em;
    text-align: left;
    border-bottom: 1px solid #e2e2e2;
`


const News = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [news, setNews] = useState([]);

    const fetchFromAirTable = async () => {
        const responseFromAirtable = await dynamicContent('news');
        setNews(responseFromAirtable.data.records);
    }

    useEffect(() => {
        fetchFromAirTable();
    }, [currentPage])

    return (<NewsWrapper>
        {news.map(newsItem => (<NewsItem key={newsItem.fields.Title}>
            <h3>{newsItem.fields.Title}</h3>
                <ReactMarkdown children={newsItem.fields.Post} /> 
            </NewsItem>))}
        </NewsWrapper>
    )
}

export default News;