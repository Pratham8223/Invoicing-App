import React, { useState } from 'react'
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Image,
    Text,
    HStack,
    InputGroup,
    InputRightElement,
    useToast,
} from '@chakra-ui/react';
import { Link, useNavigate } from "react-router-dom";
import LoginImage from '../../assets/images/login_image.jpg'
import UserAction from '../../actions/UserActions';

export default function SignUpPage() {

    const [newUser, setNewUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        conf_password: ''
    })


    const [showPassword, setShowPassword] = useState(false)
    const toast = useToast();
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        await new UserAction().createUser(newUser, (data) => {
            toast({
                title: 'Done',
                description: 'Successfully created account please login with same credentials.',
                status: 'success',
            })
            navigate({pathname : '/login'})
        }, (err) => {
            if (err === 'UNIQUE constraint failed: users_customuser.phone') {
                toast({
                    title: 'Error',
                    description: 'Phone no. already registered!',
                    status: 'error',
                })
            } else {
                toast({
                    title: 'Error',
                    description: err,
                    status: 'error',
                })
            }
            console.log({ err })
        })
    }

    return (
        <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
            <Flex flex={1}>
                <Image
                    alt={'Login Image'}
                    objectFit={'cover'}
                    src={LoginImage}
                />
            </Flex>
            <Flex p={8} flex={1} align={'center'} justify={'center'}>
                <Stack spacing={4} w={'full'} maxW={'md'}>
                    <Heading fontSize={'2xl'}>Create an <i><u>Invoicerr</u></i> account.</Heading>
                    <form onSubmit={handleSubmit}>
                        <HStack>
                            <FormControl id="first-name">
                                <FormLabel>First Name</FormLabel>
                                <Input type="text" required maxLength={20} value={newUser.first_name} onChange={e => { setNewUser({ ...newUser, first_name: e.target.value }) }} />
                            </FormControl>
                            <FormControl id="last-name">
                                <FormLabel>Last Name</FormLabel>
                                <Input type="text" required maxLength={20} value={newUser.last_name} onChange={e => { setNewUser({ ...newUser, last_name: e.target.value }) }} />
                            </FormControl>
                        </HStack>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" required value={newUser.email} onChange={e => { setNewUser({ ...newUser, email: e.target.value }) }} />
                        </FormControl>
                        <FormControl id="phone">
                            <FormLabel>Phone no.</FormLabel>
                            <Input type="number" required value={newUser.phone} onChange={e => { setNewUser({ ...newUser, phone: e.target.value }) }} />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input type={showPassword ? 'text' : "password"} required value={newUser.password} onChange={e => { setNewUser({ ...newUser, password: e.target.value }) }} />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <FormControl id="conf-password">
                            <FormLabel>Confirm Password</FormLabel>

                            <InputGroup>
                                <Input type={showPassword ? 'text' : "password"} required value={newUser.conf_password} onChange={e => { setNewUser({ ...newUser, conf_password: e.target.value }) }} />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={6}>
                            <Button colorScheme={'blue'} variant={'solid'} type='submit' mt={5}>
                                Create an account
                            </Button>
                        </Stack>
                        <br />
                        <Text>Already have an account? <Link to="/login"> <u>Login!</u></Link>⚡</Text>
                    </form>
                    <br />
                </Stack>

            </Flex>
        </Stack>
    )
}
