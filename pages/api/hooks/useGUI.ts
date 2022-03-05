import { useEffect } from "react";

type OnChangeOption = () => void
type NumberOption = {min: number, max: number, initial: number, step?: number, onChange?: OnChangeOption}

interface GUIFolder {
    [index: string]: NumberOption
}

export interface GUIOptions {
    [index: string]: NumberOption | GUIFolder;
}

const useGUI = () => {


    useEffect(() => {

    }, [])

    return 
}

export default useGUI