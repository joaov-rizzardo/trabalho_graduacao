import AsyncStorage from "@react-native-async-storage/async-storage"

export default function useStorage(){
    
    const getStorageItem = async (key: string) => {
        try{
            const item = await AsyncStorage.getItem(key)
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
            await AsyncStorage.setItem(key, value)
            return true
        }catch(error: any){
            return false
        }
    }

    const removeStorageItem = async (key: string) => {
        try{
            await AsyncStorage.removeItem(key)
            return true
        }catch(error: any){
            return false
        }
    }

    return {getStorageItem, setStorageItem, removeStorageItem}
}