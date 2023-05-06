import { SpendingCategoryEnum } from "../Enums/SpendingCategoryEnum";
import { ResultSetHeaderType, query } from "../Services/Database";

type SpendingInsertType = {
    userId: number,
    description: string,
    category: keyof typeof SpendingCategoryEnum,
    value: number,
    spentAt: string,
    isCanceled: boolean,
    canceledAt?: string
}
export default class SpendingDAO {
    public async insertAndReturnId(params: SpendingInsertType){
        const response = await query(`
            INSERT INTO
                UserSpendings
            SET
                userId = ?,
                description = ?,
                category = ?,
                value = ?,
                spentAt = ?,
                isCanceled = ?,
                canceledAt = ?
            `,
            [
                params.userId,
                params.description,
                params.category,
                params.value,
                params.spentAt,
                params.isCanceled,
                params.canceledAt
            ]
        ) as [ResultSetHeaderType, undefined] | false
        if(response === false){
            throw new Error(`Não foi possível inserir um gasto para o usuário: ${params.userId}`)
        }
        const insertedId = response[0].insertId
        return insertedId
    }
}