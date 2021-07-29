import React, { useEffect, useState } from 'react'
import dynamicContent from '@utils/dynamicContent';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import comingSoonGif from '../../assets/coming-soon.gif'
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

const Games = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [news, setNews] = useState([]);

    const fetchFromAirTable = async () => {
        const responseFromAirtable = await dynamicContent('news');
        setNews(responseFromAirtable.data.records);
    }

    useEffect(() => {
        fetchFromAirTable();
    }, [currentPage])

    return (
        <div style={{}}>
        <div style={{
            background: '#FAFAFA',
            margin: 'auto',
            width: '100%',
            height: '85%',
            padding: '0px',
            position: 'absolute',
            left: '0',
            bottom: '0',
            borderTopRightRadius: '30px',
            borderTopLeftRadius: '30px',
            }}>
        <h1 style={{color:'#07074F', paddingTop:'20px'}}>Games <br/> <span style={{color:'#42A13F'}}>Coming Soon!!</span></h1>
        <img src={comingSoonGif} width="100%"/>
        </div>
        </div>
    )
}

export default Games;