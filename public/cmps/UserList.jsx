const { Link, NavLink, useNavigate } = ReactRouterDOM

export function UserList({ users, onRemoveUser }) {
    if (!users) return <div>Loading...</div>
    return <ul className="bug-list">
        {users.map(user => (
            <li key={user._id}>
                <p>{user.fullname}</p>
                <section className="actions">
                    <button><Link to={`/user/${user._id}`}>Details</Link></button>
                    <button onClick={() => onRemoveUser(user._id)}>x</button>
                </section>
            </li>
        ))}
    </ul >
}
