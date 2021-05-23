import React, { useEffect, useState } from 'react'
import dynamicContent from '@utils/dynamicContent';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

const NewsWrapper = styled.div`
    display: block;
    max-height: 700px;
    overflow-y: scroll;
`

const NewsItem = styled.div`
    margin-top: 10px;
    width: 100%;
    display: block;
    font-size: 1em;
    text-align: left;
    min-height: 200px;
    border-bottom: 1px solid #e2e2e2;
`

const NewsImage = styled.img`
    width: 100%;
    min-height: 200px;
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
            <h3>{newsItem.fields.Notes}</h3>
            {newsItem.fields.Image && <NewsImage src={newsItem.fields.Image[0].url} />}
            
                <ReactMarkdown children={newsItem.fields.Post} /> 
            </NewsItem>))}
        </NewsWrapper>
    )
}

export default News;