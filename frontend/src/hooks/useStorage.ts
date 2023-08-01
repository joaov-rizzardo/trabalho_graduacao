import * as SecureStore from 'expo-secure-store';

export default function useStorage(){
    
    const getStorageItem = async (key: string) => {
        try{
            const item = await SecureStore.getItemAsync(key)
            if(item === null){
                throw new Error('Item not found')
            }
            return item
        }catch(error: any){
            return false
        }
    }

    const setStorageItem = async (key: string, value: string) => {
        try{
            await SecureStore.setItemAsync(key, value)
            return true
        }catch(error: any){
            return false
        }
    }

    const removeStorageItem = async (key: string) => {
        try{
            await SecureStore.deleteItemAsync(key)
            return true
        }catch(error: any){
            return false
        }
    }

    return {getStorageItem, setStorageItem, removeStorageItem}
}