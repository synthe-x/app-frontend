import React,{useEffect,useState} from 'react';
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Button,
	TableContainer,
	Box,
	Text,
	Flex,
	useDisclosure,useColorMode
} from '@chakra-ui/react';
import Image from 'next/image';
import IssueModel from './modals/IssueModal';
import RepayModel from './modals/RepayModal';
import ReactPaginate from 'react-paginate';
const itemsPerPage = 5;
const IssuanceTable =({ debts, minCRatio, collateralBalance, cRatio }: any) => {
	const { colorMode } = useColorMode();
	const [currentItems, setCurrentItems] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const [itemOffset, setItemOffset] = useState(0);
	useEffect(() => {
	  const endOffset = itemOffset + itemsPerPage;
	  setCurrentItems(debts.slice(itemOffset, endOffset));
	  setPageCount(Math.ceil(debts.length / itemsPerPage));
	}, [itemOffset, itemsPerPage]);

	const handlePageClick = (event) => {
	  const newOffset = (event.selected * itemsPerPage) % debts.length;
	  setItemOffset(newOffset);
	};
	return (
	  <>
	  <Flex justifyContent={"space-between"} flexDirection="column" height={"38rem"}>
		<Items debts={currentItems} minCRatio={minCRatio} collateralBalance={collateralBalance} cRatio={cRatio} />
		{debts.length >3 ?<ReactPaginate
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



const Items = ({ debts, minCRatio, collateralBalance, cRatio }: any) => {
	const { colorMode } = useColorMode();
	
	
	
	// const tknholdingImg = {
	// 	width: '30px',
	// 	marginLeft: '1rem',
	// 	marginRight: '0.5rem',
	// 	borderRadius: '100px',
	// };

	return (
		<>
			<TableContainer>
				<Table  overflow={"auto"}
					variant="simple"
					style={{
						borderCollapse: 'separate',
						borderSpacing: '0 15px',
					}}>
					<Thead>
						<Tr  bg={colorMode == "dark" ?"#171717" : "#ededed"}>
							<Th
								fontSize={'xs'}
								fontFamily="Poppins"
								color={colorMode == "dark" ?"#858585" : "#171717"}
								>
								Issuance Assets
							</Th>
							<Th
								fontSize={'xs'}
								fontFamily="Poppins"
								color={colorMode == "dark" ?"#858585" : "#171717"}
								>
								Price
							</Th>
							<Th
								fontSize={'xs'}
								fontFamily="Poppins"
								color={colorMode == "dark" ?"#858585" : "#171717"}
								>
								Protocol Debt
							</Th>
							{/* <Th
								fontSize={'sm'}
								fontFamily="Poppins"
								className="borrow_table_Head">
								Liquidity
							</Th> */}
							<Th
								fontSize={'xs'}
								fontFamily="Poppins"
								id="borrow_table_HeadingRightBorderRadius"
								className="borrow_table_Head"></Th>
						</Tr>
					</Thead>
					<Tbody>
						{debts.map((debt: any) => {
							return (
								<Tr key={debt['symbol']}  bg={colorMode == "dark" ?"#171717" : "#ededed"}>
									<Td
										id="borrow_table_dataLeftBorderRadius"
										className="borrow_table_data">
										<Box
											display="flex"
											alignItems="center"
											cursor="pointer">
											{/* <Image src="" 
                                            // width={35} height={35} 
                                            style={tknholdingImg} alt="..." /> */}
											<Box ml={2}>
												<Text
													fontSize="sm"
													fontWeight="bold"
													textAlign={'left'}>
													{debt['name'].split(" ").slice(1).join(" ")}
												</Text>
												<Text
													fontSize="xs"
													fontWeight="light"
													textAlign={'left'}>
													{debt['symbol']}
												</Text>
											</Box>
										</Box>
									</Td>
									<Td className="borrow_table_data">
										${' '}{(debt['price']*1).toFixed(2)}
									</Td>
									<Td className="borrow_table_data">
										<Box>
											<Text
												fontSize="sm"
												fontWeight="bold"
												textAlign={'left'}>
												{(debt['amount'][0]/1e18).toFixed(4)}{' '}
												{debt['symbol']}
											</Text>
											{/* <Text
												fontSize="xs"
												fontWeight="light"
												textAlign={'left'}>
												{debt['walletBalance']}{' '}
												{debt['asset']['symbol']}
											</Text> */}
										</Box>
									</Td>
									{/* <Td className="borrow_table_data">
										{debt['asset'][
											'totalLiquidity'
										].toString()}{' '}
										{debt['asset']['symbol']}
									</Td> */}
									<Td
										id="borrow_table_datarightBorderRadius"
										className="borrow_table_data">
										<Flex alignItems={'center'}>
											<IssueModel asset={debt} minCRatio={minCRatio} collateralBalance={collateralBalance} cRatio={cRatio} />
											<RepayModel asset={debt} balance={debt['walletBalance']/1e18} />
										</Flex>
									</Td>
								</Tr>
							);
						})}
					</Tbody>
				</Table>
			</TableContainer>
		</>
	);
};

export default IssuanceTable;