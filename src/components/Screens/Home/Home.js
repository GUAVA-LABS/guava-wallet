import { WalletContext } from "@utils/context";
import React, { useEffect, useState } from 'react'
import './Home.css'
import { OnBoarding } from "@components/OnBoarding/OnBoarding";
import { Modal } from "@components/Common/Modal/modal"
import { List } from "@components/Common/List/List"

// HISTORY IMPORTS
import { bnToBig } from "@utils/helpers";
const EXPLORER_API = "https://explorerapi.avax.network/v2/";


export default function Home(props) {
    
    const ContextValue = React.useContext(WalletContext);
    const { wallet } = ContextValue;
  
    const[open, setOpen] = useState({ open: false, name: ""});

    useEffect(() => {
        
    }, [open])

    function handleOpen(name) {
        setOpen({open: true, name: name})
    };
    
    function handleClose() {
        setOpen({open: false, name: ""})
    };
    
    return (
        <div className='container'>

            {/* {props.thereIsWallet && <h1>HOME</h1>}
            {!props.thereIsWallet && <OnBoarding/>} */}

            
            <TransactionHistory address={wallet.address} avaxBalance={wallet.avaxBalance} />
            {/* {!loading && wallet && <WalletInfo />}
            {!loading && !wallet ? <OnBoarding /> : null} */}
        </div>
    )
}

const TransactionHistory = ({ address, avaxBalance }) => {
    const [txHistory, setTxHistory] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(false);
    const LIMIT = 8;
    const getOutputs = (outputs, isSend, address) => {
      return outputs.filter(output => isSend ? !output.addresses.includes(address) : output.addresses.includes(address));
    }
  
    const fetchTxHistory = async (addr, offset, currentPage) => {
      setLoading(true);
      const address = addr.replace("X-", "");
      try {
        const response = await fetch(
          `${EXPLORER_API}transactions?address=${address}&sort=timestamp-desc&limit=${LIMIT}&offset=${offset}`
        );
        const data = await response.json();
        const transactions = data.transactions.map((tx) => {
          const inputAddress = tx.inputs[0].credentials[0].address;
          const isSend = inputAddress === address;
          const outputsForAddress = getOutputs(tx.outputs, isSend, address);
          const amount = outputsForAddress.reduce(
            (accumulator, output) => accumulator.plus(output.amount),
            bnToBig(0, 9)
          );
          const date = new Date(tx.timestamp).toLocaleDateString();
          return {
            address: isSend ? outputsForAddress[0].addresses[0] : inputAddress,
            type: isSend,
            amount: `${bnToBig(amount, 9).toString()} AVAX`,
            date,
          };
        });
        const newTxHistory = [...txHistory, ...transactions];
        if (transactions.length < LIMIT) {
          if (!total) setTotal(newTxHistory.length);
        }
        setTxHistory(newTxHistory);
      } catch (e) {
        setError("Error occured. Try again later.");
      }
      setLoading(false);
    };
  
    const handleTableChange = async (pagination, filters, sorter) => {
      const previousPage = pagination.current - 1;
      if (!total && previousPage * 3 >= txHistory.length - 3)
        await fetchTxHistory(
          address,
          (pagination.current - 1) * 3 + 1,
          pagination.current
        );
    };
  
    React.useEffect(() => {
      setTxHistory([]);
      setTotal(false);
      console.log('refetching....');
      if (address) fetchTxHistory(address, 0, 0);
  
      return () => {
          setTxHistory([]);
          setTotal(false);
      }
  
    }, [address, avaxBalance]);
  
    const columns = [
      {
        title: "",
        dataIndex: "type",
        key: "type",
        render: (type) => (
          <>
            {/* {type && <Tag color="volcano">SENT</Tag>} */}
            {/* {!type && <Tag color="green">RECEIVED</Tag>} */}
          </>
        ),
      },
      {
        title: "Address",
        dataIndex: "address",
        width: 100,
        ellipsis: true,
        render: (address) => (
        //   <Tooltip placement="topLeft" title={address}>
        //     {address}
        //   </Tooltip>
        console.log(address)
        ),
        key: "address",
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
      },
    ];
  
    return (
      <div style={{marginTop: '8px'}}>
        { txHistory.length > 0 ? txHistory.map( item => <List data={item} />) : <div className='tx-history'> You don't have transactions yet</div>}


        {/* <StyledTable
          loading={loading}
          dataSource={txHistory}
          columns={columns}
          onChange={handleTableChange}
          pagination={{
            total,
            pageSize: 3,
            showSizeChanger: false,
            disabled: loading,
            showTitle: false,
            itemRender: (current, type, originalElement) => {
              return originalElement;
            },
          }}
        /> */}
      </div>
    );
  };