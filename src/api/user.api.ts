import { api } from "./axios"


export interface User {
    id: number
    name: string
    email: string
}

export const getUsers = async (): Promise<User[]> => {
    const res = await api.get('/users')
    return res.data
}

export const getUser = async (id: number): Promise<User> => {
    const res = await api.get(`/users/${id}`)
    return res.data
}