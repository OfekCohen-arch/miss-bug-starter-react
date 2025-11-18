const { useState, useEffect } = React

import { userService } from "../services/user.service.js"
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { UserList } from "../cmps/UserList.jsx"

export function UserIndex() {
    const [users, setUsers] = useState(null)
    useEffect(loadUsers, [])

    function loadUsers() {
        userService.query()
            .then(setUsers)
            .catch(err => showErrorMsg(`Couldn't load users - ${err}`))
    }
    function onRemoveUser(userId) {
        userService.remove(userId)
            .then(() => {
                const usersToUpdate = users.filter(user => user._id !== userId)
                setUsers(usersToUpdate)
                showSuccessMsg('user removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove user`, err))
    }
    
    return (
        <div>
        <h1>Users</h1>
        <UserList users={users} onRemoveUser={onRemoveUser}/>
        </div>
    )
}