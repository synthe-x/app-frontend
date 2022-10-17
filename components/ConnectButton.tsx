import React, { useContext, useEffect, useState } from 'react';
import {
	Button,
	Box,
	Text,
	Flex,
	useDisclosure,
	Input,
	IconButton,
	InputRightElement,
	InputGroup,
	Spinner,
	Link,
} from '@chakra-ui/react';

import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from '@chakra-ui/react';

import { BsPlusCircle } from 'react-icons/bs';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { getContract } from '../src/utils';

import { WalletContext } from './WalletContextProvider';

const ConnectButton = ({}) => {
	const { isConnected, isConnecting, address, connect } = useContext(WalletContext);

	useEffect(() => {
		// setAddress(window.tronWeb.defaultAddress.base58)
	}, []);

	return (
		<Box>
			{isConnected ? (
				<Box>
					<Button> <Text w="8rem" whiteSpace={"nowrap"} textOverflow="ellipsis" overflow={"hidden"}> {address}</Text> </Button>
				</Box>
			) : (
				<Button
					bgColor={'#0CAD4B'}
					onClick={connect}
					isLoading={isConnecting}

          >
					Connect Wallet
				</Button>
			)}
		</Box>
	);
};

export default ConnectButton;
