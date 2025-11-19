const { Link, NavLink, useNavigate } = ReactRouterDOM

export function UserList({ users, onRemoveUser }) {
    if (!users) return <div>Loading...</div>
    return <ul className="bug-list">
        {users.map(user => (
            <li key={user._id}>
                <section className="actions">
                    <h4>{user.fullname}</h4>
                    <button><Link to={`/user/${user._id}`}>Details</Link></button>
                    <button onClick={() => onRemoveUser(user._id)}>x</button>
                </section>
            </li>
        ))}
    </ul >
}
