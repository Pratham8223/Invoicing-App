import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginContext } from '../../contexts/LoginContextProvider';
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
    Stack,
    Image,
    useToast,
} from '@chakra-ui/react';
import LoginImage from '../../assets/images/login_image.jpg'
import AuthAction from '../../actions/AuthAction';
import { loadingRef } from '../../refs/LoadingRef';

export default function LoginPage() {
    const navigate = useNavigate()
    const { isLoggedIn, setIsLoggedIn } = useContext(loginContext)
    const toast = useToast()
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const { current } = useRef(loadingRef)

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/home', { replace: true })
        }
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        current.current.continuousStart()
        await new AuthAction().signIn(credentials, (data) => {
            setIsLoggedIn(true)
            navigate('/home', { replace: true })
        }, (err) => {
            if (err === 'Incorrect password.') {
                setCredentials({ ...credentials, password: '' })
            }
            toast({
                title: "Error",
                description: err,
                isClosable: true,
                position: 'top-left',
                status: 'error'
            })
        })
        current.current.complete()
    }

    return (
        <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
            <Flex p={8} flex={1} align={'center'} justify={'center'}>
                <Stack spacing={4} w={'full'} maxW={'md'}>
                    <Heading fontSize={'2xl'}>Sign in to your <i><u>Invoicerr</u></i> account.</Heading>
                    <form onSubmit={handleSubmit}>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" required value={credentials.email} onChange={e => { setCredentials({ ...credentials, email: e.target.value }) }} />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <Input type="password" required value={credentials.password} onChange={e => { setCredentials({ ...credentials, password: e.target.value }) }} />
                        </FormControl>
                        <Stack spacing={6}>
                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'space-between'}>
                                <Link color={'blue.500'}>Forgot password?</Link>
                            </Stack>
                            <Button colorScheme={'blue'} variant={'solid'} type='submit'>
                                Sign in
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Flex>
            <Flex flex={1}>
                <Image
                    alt={'Login Image'}
                    objectFit={'cover'}
                    src={LoginImage}
                />
            </Flex>
        </Stack>
    );
}