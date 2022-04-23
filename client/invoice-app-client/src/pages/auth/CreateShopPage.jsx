import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    HStack,
    Textarea,
    Stack,
    Button,
    Heading,
    Text,
    useToast,
    useColorModeValue,
    Link,
} from '@chakra-ui/react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ShopAction from '../../actions/ShopAction';
import { profileContext } from '../../contexts/ProfileContextProvider';


export default function CreateShop() {


    const [shop, setShop] = useState({
        name: '',
        website: '',
        address: '',
        contact_person_name: '',
        contact_person_designation: '',
        contact_person_phone: '',
        gstin_no: '',
    })

    const navigate = useNavigate()
    const { setProfile, profile } = useContext(profileContext)
    const toast = useToast()

    const handleSubmit = async (e) => {
        e.preventDefault();
        await new ShopAction().createShop(shop, (data) => {
            setProfile({ ...profile, shop: data })
            toast({
                title: "Shop Created!",
                description: "Successfully created a shop " + data.name,
                isClosable: true,
                status: 'success',
            })
            navigate('/home', { replace: true })
        }, (err) => {
            if (err === "Shop already exists, try editing shop else.") {
                navigate('/home', { replace: true })
            }
            toast({
                title: "Unable to create shop!",
                description: err,
                isClosable: true,
                status: 'error',
            })
        })
    }

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Enter Shop Details
                    </Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        to enjoy all of our cool features ✌️
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <form onSubmit={handleSubmit}>
                            <FormControl id="shop-name" isRequired>
                                <FormLabel>Shop Name</FormLabel>
                                <Input value={shop.name} onChange={e => { setShop({ ...shop, name: e.target.value }) }} type="text" maxLength={30} placeholder='SP Stationeries' required />
                            </FormControl>
                            <HStack>
                                <Box>
                                    <FormControl id="contact-person" isRequired>
                                        <FormLabel>Contact Person Name</FormLabel>
                                        <Input value={shop.contact_person_name} onChange={e => { setShop({ ...shop, contact_person_name: e.target.value }) }} type="text" placeholder='Suyash' maxLength={30} required />
                                    </FormControl>
                                </Box>
                                <Box>
                                    <FormControl id="contact-person designation" isRequired>
                                        <FormLabel>Contact Person Desig.</FormLabel>
                                        <Input value={shop.contact_person_designation} onChange={e => { setShop({ ...shop, contact_person_designation: e.target.value }) }} type="text" placeholder='Owner' maxLength={10} required />
                                    </FormControl>
                                </Box>
                            </HStack>
                            <FormControl id="phone" isRequired>
                                <FormLabel>Phone No.</FormLabel>
                                <Input value={shop.contact_person_phone} onChange={e => { setShop({ ...shop, contact_person_phone: e.target.value }) }} type="number" maxLength={10} placeholder='91XXXXXXXXXX' required />
                            </FormControl>

                            <FormControl id="address" isRequired>
                                <FormLabel>Shop Address</FormLabel>
                                <Textarea value={shop.address} onChange={e => { setShop({ ...shop, address: e.target.value }) }} type="text" maxLength={50} placeholder='15 Hawkins Creek Road, Cazenovia,wi, 53924  Un' required />
                            </FormControl>

                            <FormControl id="website" >
                                <FormLabel>Shop Website</FormLabel>
                                <Input value={shop.website} onChange={e => { setShop({ ...shop, website: e.target.value }) }} type="text" maxLength={50} placeholder='https://hiresuyash.com' />
                            </FormControl>

                            <FormControl id="gstin">
                                <FormLabel>GST No.</FormLabel>
                                <Input value={shop.gstin_no} onChange={e => { setShop({ ...shop, gstin_no: e.target.value }) }} type="text" maxLength={20} />
                            </FormControl>

                            <Stack spacing={10} pt={2}>
                                <Button
                                    type='submit'
                                    loadingText="Submitting"
                                    size="lg"
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    Sign up
                                </Button>
                            </Stack>
                        </form>
                        <Stack pt={6}>
                            <Text align={'center'}>
                                Already a user? <Link color={'blue.400'}>Login</Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}