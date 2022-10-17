import {
	Box,
	Text,
	Flex,
	Divider,
	useColorMode,
	Progress,
	Input,
	Select,
	Button,
} from '@chakra-ui/react';
import {
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	TableContainer,
} from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import IssuanceTable from '../components/IssuanceTable';
import CollateralTable from '../components/CollateralTable';
import { useContext, useEffect, useState } from 'react';
import { getContract } from '../src/utils';
import { useAccount } from 'wagmi';
import web3 from 'web3';
import Chart from '../components/DonutChart';
import axios from 'axios';
import { WalletContext } from '../components/WalletContextProvider';
import ConnectButton from '../components/ConnectButton';
import Swap from '../components/Swap';
import { AiOutlineEnter } from 'react-icons/ai';
import { BiExit } from 'react-icons/bi';
import TransferModal from './modals/TransferModal';
import { MdOpenInNew } from 'react-icons/md';
import Link from 'next/link';


import ReactPaginate from 'react-paginate';
const itemsPerPage = 5;

const ExchangeSideBar =() => {
	const { colorMode } = useColorMode();
	const [currentItems, setCurrentItems] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const [itemOffset, setItemOffset] = useState(0);


	const {
		synths,
	} = useContext(WalletContext);
	useEffect(() => {
	  const endOffset = itemOffset + itemsPerPage;
	  setCurrentItems(synths.slice(itemOffset, endOffset));
	  setPageCount(Math.ceil(synths.length / itemsPerPage));
	}, [itemOffset, itemsPerPage]);

	const handlePageClick = (event) => {
	  const newOffset = (event.selected * itemsPerPage) % synths.length;
	  setItemOffset(newOffset);
	};



	return (
	  <>
	   <Flex justifyContent={"space-between"} mt="5rem"  bgColor={colorMode=="light"?"#f7f7f7" :'#171717'} flexDirection="column" height={"28rem"} >
		<Items synths={currentItems}  />
		
		{synths.length >3 ? <ReactPaginate
		  nextLabel=">"
		  onPageChange={handlePageClick}
		  pageRangeDisplayed={3}
		  marginPagesDisplayed={2}
		  pageCount={pageCount}
		  previousLabel="<"
		  pageClassName="page-item"
		  pageLinkClassName="page-link"
		  previousClassName="page-prev"
		  previousLinkClassName="page-link"
		  nextClassName="page-next"
		  nextLinkClassName="page-link"
		  breakLabel="..."
		  breakClassName="page-item"
		  breakLinkClassName="page-link"
		  containerClassName="pagination"
		  activeClassName="active"
		  renderOnZeroPageCount={null}
		/>:""}
		</Flex>
	  </>
	);
  }



function Items({synths}:any) {
	const { colorMode } = useColorMode();

	const {
		isConnected,
		isConnecting,
		address,
		connect,
		totalDebt,
		isDataReady,
		tradingPool,
		setTradingPool,
		pools,
		poolUserData,
	} = useContext(WalletContext);

	const updatePoolIndex = (e: any) => {
		setTradingPool(e.target.value);
	};

	return (
		<>
			<Box  px="0.3rem">
                <Text mt={10} mb={2} fontSize={"xs"} fontWeight="bold" color={"#626262"} ml={1}>CHOOSE A POOL</Text>
				<Select
					mb={5} 
					onChange={updatePoolIndex}
					value={tradingPool}
					bgColor={colorMode=="light"?"#FFFFFF" :'#171717'}
					height="50"
					border={"2px solid #FFFFFF"}
                    >
					{pools.map((pool: any, index: number) => {
						return (
							<option key={pool['symbol']} value={index} >
								<Text>{pool['name']}</Text>
							</option>
						);
					})}
				</Select>
				 {/* bgColor="#171717" */}
				<TableContainer rounded={6} >
					<Table  variant="simple" size="sm"  bgColor={colorMode=="light"?"#FFFFFF" :'#171717'}>
						<Thead > 
							<Tr height={"3rem"} bg={ colorMode=="light"?"#FFFFFF":'#171717'}>
								<Th fontWeight={"bold"} fontSize="sm">Asset</Th>
								<Th fontWeight={"bold"} fontSize="sm">Balance</Th>
								<Th></Th>
							</Tr>
						</Thead>
						<Tbody>
							{synths.map((_synth: any, index: number) => {
								return (
									<Tr key={index} >
										<Td>
											{_synth.name
												.split(' ')
												.slice(1)
												.join(' ')}
										</Td>
										<Td>
											{(_synth.amount[tradingPool]/10**_synth.decimal).toFixed(2)}{' '}
											{_synth.symbol}
										</Td>
										<Td>
                                            <TransferModal asset={_synth} />
										</Td>
									</Tr>
								);
							})}
						</Tbody>
					</Table>
				</TableContainer>
			</Box>
		</>
	);
}

export default ExchangeSideBar;
