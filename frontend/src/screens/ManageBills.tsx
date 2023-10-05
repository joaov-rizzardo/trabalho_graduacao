import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";
import { useContext, useEffect, useState } from "react";
import { backendApi } from "../configs/Api";
import { colors } from "../configs/Theme";
import IconButton from "../components/IconButton";
import { SpendingCategoryImages } from "../types/CategoryTypes";
import { dateDiferenceInDays } from "../Utils/DateUtils";
import { PopupContext } from "../contexts/PopupContext";
import { BillType } from "../types/ApiResponses/BillTypes";

async function findActiveBills(){
    try{
        const {data: bills} = await backendApi.get<BillType[]>('/bill/activeBills')
        return bills.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }catch(error: any){
        console.log(error)
        return []
    }
}

export default function ManageBills() {
    const [search, setSearch] = useState<string>("")
    const [bills, setBills] = useState<BillType[]>([])
    const {openAlertPopup, openConfirmPopUp} = useContext(PopupContext)

    useEffect(() => {
        findActiveBills().then(bills => setBills(bills))
    }, [])

    async function handleCancelBill(billId: number){
        try{
            await backendApi.put(`bill/cancel/${billId}`)
            setBills(bills.filter(bill => bill.biilId !== billId))
            return openAlertPopup({
                title: 'Atenção',
                content: 'A conta foi cancelada com sucesso.'
            })
        }catch(error: any){
            console.log(error)
            return openAlertPopup({
                title: 'Atenção',
                content: 'Não foi possível cancelar a conta, tente novamente mais tarde.'
            })
        }
    }

    return (
        <ScreenTemplate>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <CustomInput.Container>
                    <CustomInput.Icon iconName="search" />
                    <CustomInput.Input placeholder="Buscar categoria" value={search} onChangeText={text => setSearch(text)} />
                </CustomInput.Container>
                {bills.flatMap((bill, index) => {
                    if(search !== "" && !bill.description.toLowerCase().includes(search.toLowerCase())){
                        return false
                    }
                    return (
                        <View style={styles.itemContainer} key={index}>
                            <Image source={SpendingCategoryImages[bill.categoryKey]} style={styles.itemImage} />
                            <View style={{
                                flex: 1,
                                height: 36,
                                justifyContent: 'space-between',
                                alignSelf: 'center',
                            }}>
                                <Text style={{ ...styles.text, fontSize: 12, color: colors.text }}>{bill.description}</Text>
                                <Text style={{ ...styles.text, fontSize: 8, color: colors.highlight }}>{bill.billType === "F" ? "Fixo" : "Variável"}</Text>
                                <Text style={{ ...styles.text, fontSize: 16, color: colors.mainColor }}>{bill.categoryDescription}</Text>
                            </View>
                            <View style={{ alignSelf: 'flex-end' }}>
                                <Text style={{ ...styles.text, fontSize: 16, color: colors.highlight }}>{bill.installments[0].value?.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                })}</Text>
                            </View>
                            {(bill.billType === "F" || dateDiferenceInDays(new Date(bill.createdAt), new Date()) < 1) && (
                                <IconButton 
                                    onPress={() => {
                                        openConfirmPopUp({
                                            title: 'Atenção',
                                            content: 'Você tem certeza que deseja cancelar a conta? Essa ação é irreversível',
                                            onConfirm: () => handleCancelBill(bill.biilId)
                                        })
                                    }}
                                    style={{alignSelf: 'flex-end'}} 
                                    icon="delete" size={28} 
                                    color={colors.mainColor}
                                />
                            )}
                        </View>
                    )
                })}
            </ScrollView>
        </ScreenTemplate>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 16
    },
    itemContainer: {
        borderRadius: 10,
        flexDirection: 'row',
        backgroundColor: colors.sections,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12
    },
    itemImage: {
        width: 36,
        height: 36,
        alignSelf: 'center'
    },
    text: {
        fontFamily: 'ComicNeue_400Regular'
    }
})