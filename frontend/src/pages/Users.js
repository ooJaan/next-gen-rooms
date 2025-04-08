import React, { useState, useEffect, useContext } from "react";
import Select from 'react-select';

import { useApi } from "../helpers/api";
import Table from "../comps/Table";
import { AuthContext } from "../provider/AuthProvider";
import Loading from "../comps/Loading";

const RoleSelect = ({ options, value, setValue, disabled }) => {
    return (
        <>
            <Select
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

    const columns = [
        { key: 'username', label: 'Username', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { 
            key: 'role', 
            label: 'Rolle',
            sortable: true,
            render: (row) => (
                <RoleSelect 
                    options={options} 
                    value={options.find(option => option.value === row.roleId) || null}
                    setValue={(value) => setRole(value, row.id)}
                    disabled={row.id === c_userId}
                />
            )
        },
        { 
            key: 'actions', 
            label: 'Löschen',
            sortable: false,
            render: (row) => (
                <button className="delete-button" 
                    onClick={() => deleteUser(row.id)}
                    disabled={row.id === c_userId}
                >
                    Löschen
                </button>
            )
        }
    ];

    const tableData = Object.entries(users).map(([id, data]) => ({
        id,
        username: data.username,
        email: data.email,
        roleId: data.roleId
    }));

    if(loading) {
        return <Loading />
    }

    return (
        <div>
            <Table
                head={
                    <tr>
                        <th>Benutzername</th>
                        <th>Email</th>
                        <th>Rolle</th>
                        <th>Löschen</th>
                    </tr>
                }
                data={tableData}
                columns={columns}
            />
        </div>
    )
}

export default Users;