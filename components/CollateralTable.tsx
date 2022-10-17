import React,{useEffect,useState} from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption, Button, useDisclosure,
  TableContainer, Box, Text, Flex,useColorMode
} from '@chakra-ui/react'

import DepositModal from './modals/DepositModal';
import WithdrawModal from './modals/WithdrawModal';

import { FiMinusCircle } from 'react-icons/fi';
import Image from 'next/image';
import { getContract } from '../src/utils';
import ReactPaginate from 'react-paginate';
const itemsPerPage = 5;


const CollateralTable = ({collaterals, cRatio}: any) => {
	const { colorMode } = useColorMode();
	const [currentItems, setCurrentItems] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const [itemOffset, setItemOffset] = useState(0);
	useEffect(() => {
	  const endOffset = itemOffset + itemsPerPage;
	  setCurrentItems(collaterals.slice(itemOffset, endOffset));
	  setPageCount(Math.ceil(collaterals.length / itemsPerPage));
	}, [itemOffset, itemsPerPage]);

	const handlePageClick = (event) => {
	  const newOffset = (event.selected * itemsPerPage) % collaterals.length;
	  setItemOffset(newOffset);
	};
	return (
	  <>
     <Flex justifyContent={"space-between"} flexDirection="column" height={"38rem"}>
		<Items collaterals={currentItems}  cRatio={cRatio} />
    {collaterals.length >3 ?<ReactPaginate
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




const Items = ({collaterals, cRatio}: any) => {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [claimLoading, setClaimLoading] = useState(false);

  const claim = async () => {
    setClaimLoading(true)
    let wtrx = await getContract("WTRX");
    wtrx.deposit().send({shouldPollResponse:true}, (err: any, hash: string) => {
      if (err) {
        console.log(err);
        setClaimLoading(false)
      } 
      if(hash) {
        console.log(hash);
        setClaimLoading(false)
      }
    })
  }
  return (
    <div>
      <Table variant='simple' style={{ borderCollapse: "separate", borderSpacing: "0 15px" }}>
        <Thead>
          <Tr  bg={colorMode == "dark" ?"#171717" : "#ededed"}>
            <Th color={colorMode == "dark" ?"#858585" : "#171717"} fontSize={"xs"} fontFamily="Poppins" id='borrow_table_HeadingLeftBorderRadius' className='borrow_table_Head'>Collateral Assets</Th>
            <Th color={colorMode == "dark" ?"#858585" : "#171717"} fontSize={"xs"} fontFamily="Poppins" className='borrow_table_Head'>Protocol Balance</Th>
            <Th color={colorMode == "dark" ?"#858585" : "#171717"} fontSize={"xs"} fontFamily="Poppins" id='borrow_table_HeadingRightBorderRadius' className='borrow_table_Head'></Th>
          </Tr>
        </Thead>
        <Tbody>
          {collaterals.map((collateral: any) => {
          return <Tr key={collateral['symbol']}  bg={colorMode == "dark" ?"#171717" : "#ededed"}>
            <Td id='borrow_table_dataLeftBorderRadius' className='borrow_table_data'>
              <Box display="flex" alignItems="center" cursor="pointer"  >
                {/* <Image src="" 
                // width={35} height={35} 
                style={tknholdingImg} alt="logo" /> */}
                <Box ml={2}>
                  <Text color={colorMode == "dark" ?"#FFFFF" : "#171717"} fontSize='sm' fontWeight="bold" textAlign={"left"}>{collateral['name']}</Text>
                  <Text color={colorMode == "dark" ?"#FFFFF" : "#171717"} fontSize='xs' fontWeight="light" textAlign={"left"}>{collateral['symbol']}</Text>

                </Box>
              </Box>
            </Td>
            <Td className='borrow_table_data'>
              <Box>
                  <Text fontSize='sm' fontWeight="bold" textAlign={"left"}>{(collateral['amount']/10**collateral['decimal']).toFixed(3)} {collateral['symbol']}</Text>
                  {collateral['symbol'] == "WTRX" ? 
                    <Button mt={2} isLoading={claimLoading} size={"xs"} rounded="100" colorScheme="whatsapp" onClick={claim}>Get WTRX Tokens</Button> 
                  : <></>}
                  {/* <Text fontSize='xs' fontWeight="light" textAlign={"left"}>{(collateral['walletBalance']/10**collateral['asset']['decimals']).toFixed(4)} {collateral['asset']['symbol']}</Text> */}
                </Box>
              </Td>

            <Td id='borrow_table_datarightBorderRadius' className='borrow_table_data'>
              <Flex alignItems={"center"}>
                <DepositModal asset={collateral} balance={(collateral['walletBalance']/10**collateral['decimal'])} />
                <WithdrawModal asset={collateral} balance={(collateral['amount']/10**collateral['decimal'])} />
              </Flex>
            </Td>
          </Tr>
          })
          }

        </Tbody>
      </Table>
    </div>
  )
}

export default CollateralTable