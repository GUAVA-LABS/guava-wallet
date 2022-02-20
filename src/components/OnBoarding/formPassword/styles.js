import styled from 'styled-components'

export const Container = styled.div`
    width: 100%;
    align-items: center;
    form {

        h1 {
            font-size: 14px;
        }
    
        input {
            flex: 1;
            background: transparent;
            border-radius: 6px;            
            width: 160px;
            height: 6px;
            padding: 12px;

            &::placeholder {
                color: #000;
            }
        }
    }
`;

export const Submit = styled.div`
    margin: 0 auto;
    display: block;
`