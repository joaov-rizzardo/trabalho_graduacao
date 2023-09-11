import useFinance from "./useFinance";
import useLevel from "./useLevel";

export default function useUser(){
    const finances = useFinance()
    const level = useLevel()

    return {finances, level}
}