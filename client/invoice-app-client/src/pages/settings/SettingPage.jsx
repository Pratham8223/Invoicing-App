import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Container, HStack, IconButton, Input, Spacer, StackDivider, Text, toast, useDisclosure, useToast, VStack } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { FiEdit } from 'react-icons/fi'
import ShopAction from '../../actions/ShopAction';
import UserAction from '../../actions/UserActions';
import { profileContext } from '../../contexts/ProfileContextProvider';

export default function SettingPage() {

  const { profile, setProfile } = useContext(profileContext)

  return <Container maxW='container.2xl'>
    <Text fontWeight='semibold' marginY={2} fontSize='3xl'>Account Details</Text>
    <hr style={{ marginBottom: '1rem' }} />
    <Text fontWeight='semibold' marginY={2} fontSize='xl'>Your Account</Text>
    <ProfileDetailsBox profile={profile} setProfile={setProfile} />
    <br />
    <Text fontWeight='semibold' marginY={2} fontSize='xl'>Your Shop</Text>
    <ShopDetailsBox profile={profile} setProfile={setProfile} />
    <br />
  </Container>
}


const ProfileDetailsBox = ({ profile, setProfile }) => {

  const [editEntity, setEditEntity] = useState({
    displayEntity: '',
    jsonEntity: '',
    newValue: '',
  })

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()
  const toast = useToast()

  const profileEntities = [
    {
      displayEntity: 'First Name',
      jsonEntity: 'first_name',
    },
    {
      displayEntity: 'Last Name',
      jsonEntity: 'last_name',
    },
    {
      displayEntity: 'Email',
      jsonEntity: 'email',
    },
    {
      displayEntity: 'Phone',
      jsonEntity: 'phone',
    },
  ]

  const performEditAtBackend = async () => {
    let editChunk = {}
    editChunk[editEntity.jsonEntity] = editEntity.newValue;
    await new UserAction().editUser(profile.id, editChunk, (e) => {
      console.log(e)
      toast({
        title: 'Done',
        description: 'Successfully edited ' + editEntity.displayEntity,
        status: 'success',
        isClosable: true
      })
      setProfile(e)
    }, (err) => {
      toast({
        title: 'Operation failed!',
        description: err,
        status: 'error',
        isClosable: true
      })
    })
  }

  return <>
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Edit {editEntity.displayEntity}
          </AlertDialogHeader>

          <AlertDialogBody>
            <Input maxLength={46} value={editEntity.newValue} onChange={(e) => setEditEntity({ ...editEntity, newValue: e.target.value })} />
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue' onClick={() => {
              performEditAtBackend(profile.id);
            }} ml={3}>
              Edit
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>

    <Box
      borderColor='grey.800'
      borderWidth='1px'
      padding='1'
      borderRadius='md'
    >
      <VStack
        padding={2}
        alignItems='stretch'
        divider={<StackDivider />}
      >
        {
          profileEntities.map((e, i) => <HStack key={i}>
            <Box>
              <small>{e.displayEntity}</small>
              <Text fontWeight='semibold'>{profile[e.jsonEntity]}</Text>
            </Box>
            <Spacer />
            <IconButton icon={<FiEdit />} onClick={() => {
              setEditEntity(e);
              setEditEntity({ ...e, newValue: profile[e.jsonEntity] })
              onOpen();
            }} size='sm' />
          </HStack>)
        }
        <HStack>
          <Box>
            <small>Password</small>
            <Text fontWeight='semibold'>*********</Text>
          </Box>
          <Spacer />
          <Button backgroundColor='telegram.500' size='sm'>Reset Password</Button>
        </HStack>
      </VStack>
    </Box>
  </>
}

const ShopDetailsBox = ({ profile, setProfile }) => {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()
  const toast = useToast()

  const [editEntity, setEditEntity] = useState({
    displayEntity: '',
    jsonEntity: '',
    newValue: '',
  })


  const shopEntities = [
    {
      displayEntity: 'Shop Name',
      jsonEntity: 'name',
    },
    {
      displayEntity: 'Contact Person',
      jsonEntity: 'contact_person_name',
    },
    {
      displayEntity: 'Contact Person Designation',
      jsonEntity: 'contact_person_designation',
    },
    {
      displayEntity: 'Contact Person Phone',
      jsonEntity: 'contact_person_phone',
    },
    {
      displayEntity: 'Address',
      jsonEntity: 'address',
    },
    {
      displayEntity: 'Website',
      jsonEntity: 'website',
    },
    {
      displayEntity: 'Date Registered',
      jsonEntity: 'created_at',
    },
  ]


  const performEditAtBackend = async () => {
    let editChunk = {}
    editChunk[editEntity.jsonEntity] = editEntity.newValue;
    await new ShopAction().editShop(profile.shop.id, editChunk, (data) => {
      setProfile({ ...profile, shop: data })
      toast({
        title: 'Done',
        description: 'Successfully edited ' + editEntity.displayEntity,
        status: 'success',
        isClosable: true
      })
    }, (err) => {
      toast({
        title: 'Operation failed!',
        description: err,
        status: 'error',
        isClosable: true
      })
    })
  }

  return <>

    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Edit {editEntity.displayEntity}
          </AlertDialogHeader>

          <AlertDialogBody>
            <Input maxLength={46} value={editEntity.newValue} onChange={(e) => setEditEntity({ ...editEntity, newValue: e.target.value })} />
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue' onClick={() => {
              performEditAtBackend(profile.shop.id);
            }} ml={3}>
              Edit
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>

    <Box
      borderColor='grey.800'
      borderWidth='1px'
      padding='1'
      borderRadius='md'
    >
      <VStack
        padding={2}
        alignItems='stretch'
        divider={<StackDivider />}
      >
        {
          shopEntities.map((e, i) => <HStack key={i}>
            <Box>
              <small>{e.displayEntity}</small>
              <Text fontWeight='semibold'>{
                e.jsonEntity === 'created_at' ? new Date(Date.parse(profile.shop.created_at.split(":")[0].split("T")[0])).toLocaleDateString() : profile.shop[e.jsonEntity]
              }</Text>
            </Box>
            <Spacer />
            {e.jsonEntity === 'created_at' ? null : <IconButton
              onClick={() => {
                setEditEntity({ ...e, newValue: profile.shop[e.jsonEntity] })
                onOpen()
              }}
              icon={<FiEdit />} size='sm' />}
          </HStack>
          )
        }
      </VStack>
    </Box>
  </>
}