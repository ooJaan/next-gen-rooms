import React, { useState, useEffect, useContext } from "react";
import Select from 'react-select';

import { useApi } from "../helpers/api";
import Table from "../comps/Table";
import { AuthContext } from "../provider/AuthProvider";

const RoleSelect = ({ options, value, setValue, disabled }) => {
    return (
        <>
            <Select
                className="basic-single"
                classNamePrefix="select"
                value={value}
                isDisabled={disabled}
                isLoading={false}
                isClearable={false}
                isSearchable={true}
                name="role"
                options={options}
                onChange={(newValue) => setValue(newValue)}
            />
        </>
    )
}



const Users = () => {
    const { fetchWithAuth, postWithAuth, deleteWithAuth, patchWithAuth } = useApi()
    const [users, setUsers] = useState({})
    const [roles, setRoles] = useState({})
    const [options, setOptions] = useState([])
    const [loading, setLoading] = useState(true);
    const {c_userId } = useContext(AuthContext);

    useEffect(() => {
        const fetchUsers = async () => {
            setUsers(await fetchWithAuth("users"))
            setLoading(false)
        }
        const fetchRoles = async () => {
            setRoles(await fetchWithAuth("roles"))
            setLoading(false)
        }
        fetchUsers()
        fetchRoles()
    }, [])

    useEffect(() => {
        const CreateOptions = () => {
            const opts = roles ? Object.entries(roles).map(([role, data]) => ({
                label: data.name,
                value: role
            })) : [];
            setOptions(opts);
        };
        CreateOptions();
    }, [roles]);

    const deleteUser = async (userId) => {
        console.log("deleting user with id: ", userId)
        const resp = await deleteWithAuth(`users/${userId}`)
        const { [userId]: deleted, ...updatedUsers } = users;
        setUsers(updatedUsers);
    }

    const setRole = async (role, userId) => {
        console.log(role, userId);
        const data = {
            "roleId": role.value
        }
        console.log(data)
        const resp = await patchWithAuth(`users/change-role/${userId}`, data)
        const updatedUsers = { ...users };
        updatedUsers[userId].roleId = role.value;
        setUsers(updatedUsers)
    }
    if(loading){
        return "loading..."
    }


    return (
        <div>
            <Table
                head={
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Rolle</th>
                        <th>Löschen</th>
                    </tr>
                }
                body={Object.entries(users).map(([id, data]) => (
                    <tr key={id}>
                        <td>{data.username}</td>
                        <td>{data.email}</td>
                        <td>
                            <RoleSelect 
                                options={options} 
                                value={options.find(option => option.value === data.roleId) || null}
                                setValue={(value) => setRole(value, id)}
                                disabled={id ===c_userId ? true : false}
                            />
                        </td>
                        <td>
                            <button 
                                onClick={() => deleteUser(id)}
                                disabled={id === c_userId ? true: false}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            />
        </div>

    )
}

export default Users;